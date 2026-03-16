import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'

type Response = {
  message: string
  data: {
    [key: string]: unknown
  }
  meta?: unknown
}

type ResponseError = {
  errors: { message: string }[]
}

test.group('Admin / Tenant – autorización de permisos', (group) => {
  group.each.setup(async () => {
    testUtils.db().truncate()
    const syncPermissions = await ace.create(SyncPermissions, [])
    await syncPermissions.exec()
    syncPermissions.assertSucceeded()

    const syncRoles = await ace.create(SyncRoles, [])
    await syncRoles.exec()
    syncRoles.assertSucceeded()
  })

  test('listar tenants con autenticación → 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 1 }).create()
    const response = await client
      .get('/api/admin/tenants')
      .header('Host', `${tenant.slug}.localhost:3333`)
      .loginAs(user)
    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepEqual(body, {
      message: 'Tenants listados correctamente',
      data: response.body()!.data,
    })
  })

  test('listar tenants sin permiso TENANTS_READ → 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 2 }).create()
    const response = await client
      .get('/api/admin/tenants')
      .header('Host', `${tenant.slug}.localhost:3333`)
      .loginAs(user)

    response.assertStatus(403)

    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'No tienes los permisos necesarios para realizar esta acción',
        },
      ],
    })
  })

  test('listar tenants sin autenticación → 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .get('/api/admin/tenants')
      .header('Host', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'Debes iniciar sesión para acceder a esta sección',
        },
      ],
    })
  })
})
