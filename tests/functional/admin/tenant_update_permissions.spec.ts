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
}

type ResponseError = {
  errors: { message: string }[]
}

test.group('Admin / Tenant – actualizar tenant', (group) => {
  group.each.setup(async () => {
    testUtils.db().truncate()
    const syncPermissions = await ace.create(SyncPermissions, [])
    await syncPermissions.exec()
    syncPermissions.assertSucceeded()

    const syncRoles = await ace.create(SyncRoles, [])
    await syncRoles.exec()
    syncRoles.assertSucceeded()
  })

  test('actualizar tenant con autenticación y permisos → 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 1 }).create()
    const response = await client
      .patch(`/api/admin/tenants/${tenant.id}`)
      .header('Host', `${tenant.slug}.localhost:3333`)
      .json({ name: 'Nombre Actualizado' })
      .loginAs(user)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepEqual(body, {
      message: 'Tenant actualizado correctamente',
      data: response.body()!.data,
    })
  })

  test('actualizar tenant con slug duplicado → 400', async ({ client, assert }) => {
    const tenantA = await TenantFactory.merge({ slug: 'slug-existente' }).create()
    const tenantB = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenantB.id, roleId: 1 }).create()
    const response = await client
      .patch(`/api/admin/tenants/${tenantB.id}`)
      .header('Host', `${tenantB.slug}.localhost:3333`)
      .json({ slug: tenantA.slug })
      .loginAs(user)

    response.assertStatus(400)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Ya existe otro tenant con ese slug' }],
    })
  })

  test('actualizar tenant inexistente → 404', async ({ client }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 1 }).create()
    const response = await client
      .patch('/api/admin/tenants/999999')
      .header('Host', `${tenant.slug}.localhost:3333`)
      .json({ name: 'No Existe' })
      .loginAs(user)

    response.assertStatus(404)
  })

  test('actualizar tenant sin permiso TENANTS_WRITE → 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 2 }).create()
    const response = await client
      .patch(`/api/admin/tenants/${tenant.id}`)
      .header('Host', `${tenant.slug}.localhost:3333`)
      .json({ name: 'Sin Permiso' })
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

  test('actualizar tenant sin autenticación → 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .patch(`/api/admin/tenants/${tenant.id}`)
      .header('Host', `${tenant.slug}.localhost:3333`)
      .json({ name: 'Sin Auth' })

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
