import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import { Status } from '#enums/status_enum'
import Tenant from '#models/tenant'
import Role from '#models/role'
import { RoleCode } from '#enums/role_enum'

type Response = {
  message: string
  data: {
    [key: string]: unknown
  }
}

type ResponseError = {
  errors: { message: string }[]
}

test.group('Admin / Tenant – crear tenant', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
    const syncPermissions = await ace.create(SyncPermissions, [])
    await syncPermissions.exec()
    syncPermissions.assertSucceeded()

    const syncRoles = await ace.create(SyncRoles, [])
    await syncRoles.exec()
    syncRoles.assertSucceeded()
  })

  test('crear tenant con autenticación y permisos → 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      name: 'Gym Test',
      slug: 'gym-test',
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(user)

    response.assertStatus(201)

    const body = response.body()! as Response

    assert.equal(body.message, 'Tenant creado correctamente')
    assert.equal(body.data.name, payload.name)
    assert.equal(body.data.slug, payload.slug)
    assert.equal(body.data.status, payload.status)
    assert.isNumber(body.data.id)
    assert.isString(body.data.createdAt)
    assert.isString(body.data.updatedAt)

    const tenantDB = await Tenant.findOrFail(body.data.id)
    assert.equal(tenantDB.name, payload.name)
    assert.equal(tenantDB.slug, payload.slug)
    assert.equal(tenantDB.status, payload.status)
  })

  test('crear tenant con campos opcionales nulos -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      name: 'Gym Sin Extras',
      slug: 'gym-sin-extras',
      status: Status.ACTIVE,
      logoUrl: null,
      banner: null,
      backgroundImageUrl: null,
      primaryColor: null,
      secondaryColor: null,
      email: null,
      phone: null,
      address: null,
    }

    const response = await client
      .post('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(user)

    response.assertStatus(201)

    const body = response.body()! as Response

    assert.equal(body.message, 'Tenant creado correctamente')
    assert.equal(body.data.name, payload.name)
    assert.equal(body.data.slug, payload.slug)
    assert.equal(body.data.status, payload.status)
    assert.equal(body.data.logoUrl, null)
    assert.equal(body.data.banner, null)
    assert.equal(body.data.backgroundImageUrl, null)
    assert.equal(body.data.primaryColor, null)
    assert.equal(body.data.secondaryColor, null)
    assert.equal(body.data.email, null)
    assert.equal(body.data.phone, null)
    assert.equal(body.data.address, null)
    assert.isNumber(body.data.id)
    assert.isString(body.data.createdAt)
    assert.isString(body.data.updatedAt)

    const tenantDB = await Tenant.findOrFail(body.data.id as number)
    assert.equal(tenantDB.name, payload.name)
    assert.equal(tenantDB.slug, payload.slug)
    assert.equal(tenantDB.status, payload.status)
    assert.equal(tenantDB.logoUrl, null)
    assert.equal(tenantDB.banner, null)
    assert.equal(tenantDB.backgroundImageUrl, null)
    assert.equal(tenantDB.primaryColor, null)
    assert.equal(tenantDB.secondaryColor, null)
    assert.equal(tenantDB.email, null)
    assert.equal(tenantDB.phone, null)
    assert.equal(tenantDB.address, null)
  })

  test('crear tenant sin campos requeridos -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .post('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({})
      .loginAs(user)

    response.assertStatus(422)

    const body = response.body()! as ResponseError

    assert.deepEqual(body.errors, [
      {
        field: 'name',
        message: 'Nombre es obligatorio',
        rule: 'required',
      },
      {
        field: 'slug',
        message: 'Slug es obligatorio',
        rule: 'required',
      },
    ])
  })

  test('crear tenant sin permiso para crear tenants -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)

    const user = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
    }).create()

    const response = await client
      .post('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        name: 'Gym Bloqueado',
        slug: 'gym-bloqueado',
        status: Status.ACTIVE,
      })
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

    const blockedTenant = await Tenant.findBy('slug', 'gym-bloqueado')
    assert.isNull(blockedTenant)
  })

  test('crear tenant sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()

    const response = await client
      .post('/api/admin/tenants')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        name: 'Gym No Auth',
        slug: 'gym-no-auth',
        status: Status.ACTIVE,
      })

    response.assertStatus(401)

    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'Debes iniciar sesión para acceder a esta sección',
        },
      ],
    })

    const tenantDB = await Tenant.findBy('slug', 'gym-no-auth')
    assert.isNull(tenantDB)
  })
})
