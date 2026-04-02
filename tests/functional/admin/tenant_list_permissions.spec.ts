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

  test('listar tenants con autenticación -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 1 }).create()
    const response = await client
      .get(`/api/admin/tenants?q=${encodeURIComponent(tenant.slug)}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(user)
    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Tenants listados correctamente')

    // `paginate().toJSON()` devuelve `data` como array y `meta` como objeto paginado
    const tenants = body.data as unknown as unknown[]
    assert.isArray(tenants)
    assert.equal(tenants.length, 1)
    assert.equal((tenants[0] as any).slug, tenant.slug)

    const meta = body.meta as any
    assert.isDefined(meta)
    assert.equal(meta.currentPage, 1)
    assert.equal(meta.firstPage, 1)
    assert.equal(meta.firstPageUrl, '/?page=1')
    assert.equal(meta.lastPage, 1)
    assert.equal(meta.lastPageUrl, '/?page=1')
    assert.equal(meta.nextPageUrl, null)
    assert.equal(meta.previousPageUrl, null)
    assert.equal(meta.perPage, 10)
    assert.equal(meta.total, 1)
  })

  test('listar tenants sin permiso TENANTS_READ -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: 2 }).create()
    const response = await client
      .get('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
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

  test('listar tenants sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .get('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

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
