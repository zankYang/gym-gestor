import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Role from '#models/role'
import User from '#models/user'
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

test.group('User / List – autorización y filtros', (group) => {
  group.each.setup(setupDb)

  test('listar usuarios con SUPERADMIN y tenantId -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    await UserFactory.merge({ tenantId: tenantA.id, roleId: adminRole.id }).createMany(2)
    await UserFactory.merge({ tenantId: tenantB.id, roleId: adminRole.id }).createMany(2)

    const response = await client
      .get(`/api/users?tenantId=${tenantB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)

    const body = response.body()! as Response
    assert.equal(body.message, 'Usuarios listados correctamente')
    assert.isArray(body.data)
    assert.isDefined(body.meta)
    assert.equal(body.meta!.total, 2)
    ;(body.data as { tenantId: number }[]).forEach((u) => assert.equal(u.tenantId, tenantB.id))
  })

  test('listar usuarios con usuario normal (ADMIN) solo ve su tenant -> 200', async ({
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

    await UserFactory.merge({ tenantId: tenantA.id, roleId: adminRole.id }).createMany(2)
    await UserFactory.merge({ tenantId: tenantB.id, roleId: adminRole.id }).createMany(2)

    const response = await client
      .get('/api/users')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuarios listados correctamente')
    assert.isArray(body.data)
    assert.equal(body.meta!.total, 3) // adminUser + 2 del mismo tenant
    ;(body.data as { tenantId: number }[]).forEach((u) => assert.equal(u.tenantId, tenantA.id))
  })

  test('listar usuarios sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .get('/api/users')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })

  test('listar usuarios con filtro q, role, status y paginación -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@test.com',
      status: Status.ACTIVE,
    }).create()
    await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@test.com',
      status: Status.INACTIVE,
    }).create()

    const response = await client
      .get(
        '/api/users?q=Juan&role=admin&status=Activo&page=1&perPage=5&sortBy=created_at&sortDir=asc'
      )
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuarios listados correctamente')
    assert.isArray(body.data)
    assert.isTrue(
      (body.data as { firstName: string }[]).every((u) =>
        ['Juan', adminUser.firstName].includes(u.firstName)
      )
    )
  })

  test('listar usuarios con page inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/users?page=abc')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'page'))
  })

  test('listar usuarios con sortDir inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/users?sortDir=NOPE')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'sortDir'))
  })

  test('listar usuarios con status inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/users?status=NoExiste')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'status'))
  })

  test('listar usuarios con tenantId inválido en ADMIN -> 200 (se ignora)', async ({
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

    await UserFactory.merge({ tenantId: tenantA.id, roleId: adminRole.id }).create()
    await UserFactory.merge({ tenantId: tenantB.id, roleId: adminRole.id }).create()

    const response = await client
      .get('/api/users?tenantId=123')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.isTrue((body.data as { tenantId: number }[]).every((u) => u.tenantId === tenantA.id))
  })
})

test.group('User / Show – autorización y tenant', (group) => {
  group.each.setup(setupDb)

  test('ver usuario SUPERADMIN puede ver usuario de otro tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const userInB = await UserFactory.merge({
      tenantId: tenantB.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .get(`/api/users/${userInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario encontrado')
    assert.equal((body.data as { id: number }).id, userInB.id)
  })

  test('ver usuario normal (ADMIN) puede ver usuario de su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const otherUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .get(`/api/users/${otherUser.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario encontrado')
    assert.equal((body.data as { id: number }).id, otherUser.id)
  })

  test('ver usuario normal intentando acceder a usuario de otro tenant -> 404', async ({
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

    const userInB = await UserFactory.merge({
      tenantId: tenantB.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .get(`/api/users/${userInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Usuario no encontrado' }] })
  })

  test('ver usuario sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: adminRole.id }).create()
    const response = await client
      .get(`/api/users/${user.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('User / Create – validaciones y permisos', (group) => {
  group.each.setup(setupDb)

  test('crear usuario SUPERADMIN en tenant específico -> 201', async ({ client, assert }) => {
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
      lastName: 'Usuario',
      email: 'nuevo@tenantb.com',
      phone: '551234567890',
      password: 'password123',
      role: RoleCode.ADMIN,
    }

    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenantB.id)
    assert.equal((body.data as { email: string }).email, payload.email)
  })

  test('crear usuario normal (ADMIN) en su tenant -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const payload = {
      firstName: 'Nuevo',
      lastName: 'Usuario',
      email: 'nuevo@mitenant.com',
      phone: '551234567890',
      password: 'password123',
      role: RoleCode.RECEPTIONIST,
    }

    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(adminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenant.id)
  })

  test('crear usuario con email duplicado en mismo tenant -> 409', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const existingUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
      email: 'existente@test.com',
    }).create()

    const payload = {
      tenantId: tenant.id,
      firstName: 'Otro',
      lastName: 'Usuario',
      email: existingUser.email,
      phone: '551234567890',
      password: 'password123',
      role: RoleCode.ADMIN,
    }

    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(409)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Ya existe un usuario con ese email en este gym' }],
    })
  })

  test('crear usuario con mismo email en distinto tenant (SUPERADMIN) -> 201', async ({
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

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
      email: 'mismo@email.com',
    }).create()

    const payload = {
      tenantId: tenantB.id,
      firstName: 'Otro',
      lastName: 'Usuario',
      email: 'mismo@email.com',
      phone: '551987654321',
      password: 'password123',
      role: RoleCode.ADMIN,
    }

    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal((body.data as { tenantId: number }).tenantId, tenantB.id)
  })

  test('crear usuario con payload inválido (sin email) -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      firstName: 'Nuevo',
      lastName: 'Usuario',
      password: 'password123',
      role: RoleCode.ADMIN,
    }

    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isArray(body.errors)
    assert.isTrue(
      body.errors.some((e) => e.field === 'email' || e.message?.toLowerCase().includes('email'))
    )
  })

  test('crear usuario con password corta -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      firstName: 'Nuevo',
      lastName: 'Usuario',
      email: 'nuevo@test.com',
      password: 'short',
      role: RoleCode.ADMIN,
    }

    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isArray(body.errors)
    assert.isTrue(
      body.errors.some(
        (e) => e.field === 'password' || e.message?.toLowerCase().includes('password')
      )
    )
  })

  test('crear usuario sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .post('/api/users')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        firstName: 'Nuevo',
        lastName: 'Usuario',
        email: 'nuevo@test.com',
        password: 'password123',
        role: RoleCode.ADMIN,
      })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('User / Update – validaciones y tenant', (group) => {
  group.each.setup(setupDb)

  test('actualizar usuario SUPERADMIN puede actualizar usuario de otro tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const userInB = await UserFactory.merge({
      tenantId: tenantB.id,
      roleId: adminRole.id,
      firstName: 'Antes',
    }).create()

    const response = await client
      .patch(`/api/users/${userInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({ firstName: 'Después' })
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario actualizado correctamente')
    assert.equal((body.data as { firstName: string }).firstName, 'Después')
  })

  test('actualizar usuario normal (ADMIN) actualiza usuario de su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const otherUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
      firstName: 'Antes',
    }).create()

    const response = await client
      .patch(`/api/users/${otherUser.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ firstName: 'Actualizado' })
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal((body.data as { firstName: string }).firstName, 'Actualizado')
  })

  test('actualizar usuario con role (código) persiste roleId correcto -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const targetUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
      firstName: 'RolTest',
    }).create()

    const response = await client
      .patch(`/api/users/${targetUser.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ role: RoleCode.RECEPTIONIST })
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal((body.data as { roleId: number }).roleId, receptionistRole.id)

    await targetUser.refresh()
    assert.equal(targetUser.roleId, receptionistRole.id)
  })

  test('actualizar usuario normal intentando actualizar usuario de otro tenant -> 404', async ({
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

    const userInB = await UserFactory.merge({
      tenantId: tenantB.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .patch(`/api/users/${userInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({ firstName: 'No' })
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Usuario no encontrado' }] })
  })

  test('actualizar usuario con email inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const targetUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .patch(`/api/users/${targetUser.id}`)
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

  test('actualizar usuario sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: adminRole.id }).create()
    const response = await client
      .patch(`/api/users/${user.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ firstName: 'Nuevo' })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('User / Destroy – soft delete y tenant', (group) => {
  group.each.setup(setupDb)

  test('borrar usuario SUPERADMIN puede borrar usuario de otro tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const userInB = await UserFactory.merge({
      tenantId: tenantB.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .delete(`/api/users/${userInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario dado de baja correctamente')

    const deleted = await User.query().where('id', userInB.id).first()
    assert.isNotNull(deleted?.deletedAt)
  })

  test('borrar usuario normal (ADMIN) puede borrar usuario de su tenant -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const otherUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .delete(`/api/users/${otherUser.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Usuario dado de baja correctamente')

    const deleted = await User.query().where('id', otherUser.id).first()
    assert.isNotNull(deleted?.deletedAt)
  })

  test('borrar usuario normal intentando borrar usuario de otro tenant -> 404', async ({
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

    const userInB = await UserFactory.merge({
      tenantId: tenantB.id,
      roleId: adminRole.id,
    }).create()

    const response = await client
      .delete(`/api/users/${userInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Usuario no encontrado' }] })
  })

  test('borrar usuario inexistente -> 404', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .delete('/api/users/999999')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Usuario no encontrado' }] })
  })

  test('borrar usuario sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const user = await UserFactory.merge({ tenantId: tenant.id, roleId: adminRole.id }).create()
    const response = await client
      .delete(`/api/users/${user.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})
