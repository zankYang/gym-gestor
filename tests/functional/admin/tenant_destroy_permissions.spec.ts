import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Tenant from '#models/tenant'
import Role from '#models/role'
import { RoleCode } from '#enums/role_enum'

type ResponseError = {
  errors: { message: string }[]
}

test.group('Admin / Tenant – eliminar tenant', (group) => {
  group.each.setup(async () => {
    testUtils.db().truncate()
    const syncPermissions = await ace.create(SyncPermissions, [])
    await syncPermissions.exec()
    syncPermissions.assertSucceeded()

    const syncRoles = await ace.create(SyncRoles, [])
    await syncRoles.exec()
    syncRoles.assertSucceeded()
  })

  test('eliminar tenant con autenticación y permisos -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .delete(`/api/admin/tenants/${tenant.id}`)
      .header('Host', `${tenant.slug}.localhost:3333`)
      .loginAs(user)

    response.assertStatus(200)
    const body = response.body()
    assert.deepEqual(body, {
      message: 'Tenant dado de baja correctamente',
    })

    const tenantDB = await Tenant.findOrFail(tenant.id)
    console.log(tenantDB.deletedAt)
    assert.isNotNull(tenantDB.deletedAt)
  })

  test('eliminar tenant inexistente -> 404', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .delete('/api/admin/tenants/999999')
      .header('Host', `${tenant.slug}.localhost:3333`)
      .loginAs(user)

    response.assertStatus(404)

    assert.deepEqual(response.body(), {
      errors: [
        {
          message: 'Tenant no encontrado',
        },
      ],
    })
  })

  test('eliminar tenant sin permiso para dar de baja -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
    }).create()

    const response = await client
      .delete(`/api/admin/tenants/${tenant.id}`)
      .header('Host', `${tenant.slug}.localhost:3333`)
      .loginAs(user)

    response.assertStatus(403)

    const body = response.body() as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'No tienes los permisos necesarios para realizar esta acción',
        },
      ],
    })

    const tenantDB = await Tenant.find(tenant.id)
    assert.isNull(tenantDB!.deletedAt)
  })

  test('eliminar tenant sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()

    const response = await client
      .delete(`/api/admin/tenants/${tenant.id}`)
      .header('Host', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)

    const body = response.body() as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'Debes iniciar sesión para acceder a esta sección',
        },
      ],
    })

    const tenantDB = await Tenant.find(tenant.id)
    assert.isNull(tenantDB!.deletedAt)
  })
})
