import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { ClientFactory } from '#database/factories/client_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Role from '#models/role'
import Client from '#models/client'
import { UserFactory } from '#database/factories/user_factory'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

type Response = {
  message: string
  data: { [key: string]: unknown } | { [key: string]: unknown }[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    first_page: number
    last_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

type ResponseError = {
  errors: { message: string; field?: string }[]
}

async function setupDb() {
  await testUtils.db().truncate()
  const syncPermissions = await ace.create(SyncPermissions, [])
  await syncPermissions.exec()
  syncPermissions.assertSucceeded()

  const syncRoles = await ace.create(SyncRoles, [])
  await syncRoles.exec()
  syncRoles.assertSucceeded()
}

test.group('Client / List – autorización y filtros', (group) => {
  group.each.setup(setupDb)

  test('listar clientes con SUPERADMIN y tenantId -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    await ClientFactory.merge({ tenantId: tenantA.id, createdBy: superadminUser.id }).createMany(2)
    await ClientFactory.merge({ tenantId: tenantB.id, createdBy: superadminUser.id }).createMany(2)

    const response = await client
      .get(`/api/clients?tenantId=${tenantB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Clientes listados correctamente')
    assert.isArray(body.data)
    assert.isDefined(body.meta)
    assert.equal(body.meta!.total, 2)
    ;(body.data as { tenantId: number }[]).forEach((c) => assert.equal(c.tenantId, tenantB.id))
  })

  test('listar clientes con usuario normal (ADMIN) solo ve su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    await ClientFactory.merge({ tenantId: tenantA.id, createdBy: adminUser.id }).createMany(2)
    await ClientFactory.merge({ tenantId: tenantB.id, createdBy: adminUser.id }).createMany(2)

    const response = await client
      .get('/api/clients')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Clientes listados correctamente')
    assert.isArray(body.data)
    assert.equal(body.meta!.total, 2)
    ;(body.data as { tenantId: number }[]).forEach((c) => assert.equal(c.tenantId, tenantA.id))
  })

  test('listar clientes sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .get('/api/clients')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })

  test('listar clientes con page inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/clients?page=abc')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'page'))
  })

  test('listar clientes con sortDir inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/clients?sortDir=NOPE')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'sortDir'))
  })

  test('listar clientes con tenantId inválido en ADMIN -> 200 (se ignora)', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    await ClientFactory.merge({ tenantId: tenantA.id, createdBy: adminUser.id }).create()
    await ClientFactory.merge({ tenantId: tenantB.id, createdBy: adminUser.id }).create()

    const response = await client
      .get('/api/clients?tenantId=abc')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.isArray(body.data)
    assert.isTrue((body.data as { tenantId: number }[]).every((c) => c.tenantId === tenantA.id))
  })
})

test.group('Client / Show – autorización y tenant', (group) => {
  group.each.setup(setupDb)

  test('ver cliente SUPERADMIN puede ver cliente de otro tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const clientInB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: superadminUser.id,
    }).create()

    const response = await client
      .get(`/api/clients/${clientInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente encontrado')
    assert.equal((body.data as { id: number }).id, clientInB.id)
  })

  test('ver cliente normal (ADMIN) puede ver cliente de su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const otherClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .get(`/api/clients/${otherClient.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente encontrado')
    assert.equal((body.data as { id: number }).id, otherClient.id)
  })

  test('ver cliente normal intentando acceder a cliente de otro tenant -> 404', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientInB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .get(`/api/clients/${clientInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Cliente no encontrado' }] })
  })

  test('ver cliente sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const clientInTenant = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .get(`/api/clients/${clientInTenant.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('Client / Create – validaciones y permisos', (group) => {
  group.each.setup(setupDb)

  test('crear cliente SUPERADMIN en tenant específico -> 201', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      tenantId: tenantB.id,
      firstName: 'Nuevo',
      lastName: 'Cliente',
      phone: '5551234567',
      email: 'nuevo@tenantb.com',
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/clients')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenantB.id)
  })

  test('crear cliente normal (ADMIN) en su tenant -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const payload = {
      firstName: 'Nuevo',
      lastName: 'Cliente',
      phone: '5559876543',
      email: 'nuevo@mitenant.com',
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/clients')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(adminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenant.id)
  })

  test('crear cliente con payload inválido (sin phone) -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      firstName: 'Nuevo',
      lastName: 'Cliente',
      email: 'nuevo@test.com',
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/clients')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isArray(body.errors)
    assert.isTrue(
      body.errors.some((e) => e.field === 'phone' || e.message?.toLowerCase().includes('phone'))
    )
  })

  test('crear cliente sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .post('/api/clients')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        firstName: 'Nuevo',
        lastName: 'Cliente',
        phone: '5551234567',
      })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('Client / Update – validaciones y tenant', (group) => {
  group.each.setup(setupDb)

  test('actualizar cliente SUPERADMIN puede actualizar cliente de otro tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const clientInB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: superadminUser.id,
    }).create()

    const response = await client
      .patch(`/api/clients/${clientInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({ firstName: 'Después' })
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente actualizado correctamente')
    assert.equal((body.data as { firstName: string }).firstName, 'Después')
  })

  test('actualizar cliente normal (ADMIN) actualiza cliente de su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const otherClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
      firstName: 'Antes',
    }).create()

    const response = await client
      .patch(`/api/clients/${otherClient.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ firstName: 'Actualizado' })
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal((body.data as { firstName: string }).firstName, 'Actualizado')
  })

  test('actualizar cliente normal intentando actualizar cliente de otro tenant -> 404', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientInB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .patch(`/api/clients/${clientInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({ firstName: 'No' })
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Cliente no encontrado' }] })
  })

  test('actualizar cliente con email inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const targetClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: superadminUser.id,
    }).create()

    const response = await client
      .patch(`/api/clients/${targetClient.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ email: 'no-es-email' })
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isArray(body.errors)
    assert.isTrue(
      body.errors.some((e) => e.field === 'email' || e.message?.toLowerCase().includes('email'))
    )
  })

  test('actualizar cliente sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const clientInTenant = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .patch(`/api/clients/${clientInTenant.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ firstName: 'Nuevo' })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('Client / Destroy – soft delete y tenant', (group) => {
  group.each.setup(setupDb)

  test('borrar cliente SUPERADMIN puede borrar cliente de otro tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const clientInB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: superadminUser.id,
    }).create()

    const response = await client
      .delete(`/api/clients/${clientInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente dado de baja correctamente')

    const deleted = await Client.query().where('id', clientInB.id).first()
    assert.isNotNull(deleted?.deletedAt)
  })

  test('borrar cliente normal (ADMIN) puede borrar cliente de su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const otherClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .delete(`/api/clients/${otherClient.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cliente dado de baja correctamente')

    const deleted = await Client.query().where('id', otherClient.id).first()
    assert.isNotNull(deleted?.deletedAt)
  })

  test('borrar cliente normal intentando borrar cliente de otro tenant -> 404', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientInB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .delete(`/api/clients/${clientInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Cliente no encontrado' }] })
  })

  test('borrar cliente inexistente -> 404', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .delete('/api/clients/999999')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Cliente no encontrado' }] })
  })

  test('borrar cliente sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const clientInTenant = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .delete(`/api/clients/${clientInTenant.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})
