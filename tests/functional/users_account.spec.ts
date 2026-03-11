import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { Role as RoleEnum } from '#enums/role_enum'
import { GymFactory } from '#database/factories/gym_factory'
import { Status } from '#enums/status_enum'
import User from '#models/user'
import Role from '#models/role'

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

async function createRoles() {
  const superadminRole = await Role.create({
    name: 'Super Admin',
    code: RoleEnum.SUPERADMIN,
    description: 'Acceso total al sistema',
  })
  const adminRole = await Role.create({
    name: 'Admin',
    code: RoleEnum.ADMIN,
    description: 'Administrador de gym',
  })
  const receptionistRole = await Role.create({
    name: 'Recepcionista',
    code: RoleEnum.RECEPTIONIST,
    description: 'Recepcionista',
  })
  const trainerRole = await Role.create({
    name: 'Entrenador',
    code: RoleEnum.TRAINER,
    description: 'Entrenador',
  })
  return { superadminRole, adminRole, receptionistRole, trainerRole }
}

test.group('Creacion de administradores', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  test('crear un admin desde el superadmin', async ({ assert, client }) => {
    const { superadminRole, adminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
    }).create()
    const admin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
      passwordHash: '12345678',
    }).make()

    const response = await client.post('/api/users').loginAs(superadmin).json({
      tenantId: gym.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      password: '12345678',
      role: RoleEnum.ADMIN,
    })
    response.assertStatus(201)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario creado correctamente',
    })
    const createdAdmin = await User.find(body.data.id)
    assert.exists(createdAdmin)
  })

  test('crear un admin sin ser superadmin', async ({ assert, client }) => {
    const { adminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({ tenantId: gym.id, roleId: adminRole.id }).create()

    const responseAdmin = await client.post('/api/users').loginAs(admin).json({
      tenantId: gym.id,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: '12345678',
      role: RoleEnum.ADMIN,
    })
    const responseUser = await client.post('/api/users').json({
      tenantId: gym.id,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: '12345678',
      role: RoleEnum.ADMIN,
    })

    responseAdmin.assertStatus(403)
    const bodyAdmin = responseAdmin.body()! as ResponseError
    assert.deepEqual(bodyAdmin, {
      errors: [
        {
          message: 'No tienes permisos para crear admins',
        },
      ],
    })
    responseUser.assertStatus(401)
    const bodyUser = responseUser.body()! as ResponseError
    assert.deepEqual(bodyUser, {
      errors: [
        {
          message: 'Unauthorized access',
        },
      ],
    })
  })

  test('crear un admin con email ya existente', async ({ assert, client }) => {
    const { superadminRole, adminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
    }).create()
    const existingAdmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      passwordHash: '12345678',
    }).create()

    const response = await client.post('/api/users').loginAs(superadmin).json({
      tenantId: gym.id,
      firstName: existingAdmin.firstName,
      lastName: existingAdmin.lastName,
      email: existingAdmin.email,
      password: '12345678',
      role: RoleEnum.ADMIN,
    })

    response.assertStatus(409)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'Ya existe un usuario con ese email en este gym',
        },
      ],
    })
  })

  test('crear un admin con valores invalidos o faltantes', async ({ assert, client }) => {
    const { superadminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
    }).create()

    const responseNull = await client.post('/api/users').loginAs(superadmin).json({})
    const responseInvalidEmail = await client.post('/api/users').loginAs(superadmin).json({
      tenantId: gym.id,
      firstName: 'Test',
      lastName: 'User',
      email: 'admin',
      password: '12345678',
      role: RoleEnum.ADMIN,
    })
    const responseInvalidRole = await client.post('/api/users').loginAs(superadmin).json({
      tenantId: gym.id,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '12345678',
      role: 'invalid',
    })
    const responseInvalidTenantId = await client.post('/api/users').loginAs(superadmin).json({
      tenantId: 99999,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '12345678',
      role: RoleEnum.ADMIN,
    })

    responseNull.assertStatus(422)
    responseInvalidEmail.assertStatus(422)
    responseInvalidRole.assertStatus(422)
    responseInvalidTenantId.assertStatus(422)

    const bodyNull = responseNull.body()! as ResponseError
    assert.isArray(bodyNull.errors)
    assert.isNotEmpty(bodyNull.errors)
  })
})

test.group('Creacion de usuarios', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  test('crear un usuario desde el admin y superadmin', async ({ assert, client }) => {
    const { superadminRole, adminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
    }).create()
    const admin = await UserFactory.merge({ tenantId: gym.id, roleId: adminRole.id }).create()

    const responseSuperadmin = await client.post('/api/users').loginAs(superadmin).json({
      tenantId: gym.id,
      firstName: 'User',
      lastName: 'One',
      email: 'userone@test.com',
      password: '12345678',
      role: RoleEnum.RECEPTIONIST,
    })
    const responseAdmin = await client.post('/api/users').loginAs(admin).json({
      tenantId: gym.id,
      firstName: 'User',
      lastName: 'Two',
      email: 'usertwo@test.com',
      password: '12345678',
      role: RoleEnum.RECEPTIONIST,
    })

    responseSuperadmin.assertStatus(201)
    responseAdmin.assertStatus(201)
    const bodySuperadmin = responseSuperadmin.body()! as Response
    const bodyAdmin = responseAdmin.body()! as Response
    const createdSuperadmin = await User.find(bodySuperadmin.data.id)
    const createdAdmin = await User.find(bodyAdmin.data.id)
    assert.deepInclude(bodySuperadmin, { message: 'Usuario creado correctamente' })
    assert.deepInclude(bodyAdmin, { message: 'Usuario creado correctamente' })
    assert.exists(createdSuperadmin)
    assert.exists(createdAdmin)
    void receptionistRole
  })

  test('crear un usuario sin ser superadmin o admin', async ({ assert, client }) => {
    const { trainerRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const trainer = await UserFactory.merge({
      tenantId: gym.id,
      roleId: trainerRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.post('/api/users').loginAs(trainer).json({
      tenantId: gym.id,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '12345678',
      role: RoleEnum.RECEPTIONIST,
    })

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'Solo superadmin o admin del gym pueden gestionar usuarios',
        },
      ],
    })
  })
})

test.group('Listado de usuarios', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('listar usuarios como superadmin', async ({ assert, client }) => {
    const { superadminRole, adminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    await UserFactory.merge({ tenantId: gym.id, roleId: adminRole.id }).createMany(5)
    await UserFactory.merge({ tenantId: gym.id, roleId: receptionistRole.id }).createMany(8)

    const response = await client.get('/api/users').loginAs(superadmin).qs({ tenantId: gym.id })

    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuarios listados correctamente',
    })
    assert.exists(body)
    assert.isArray(body.data)
    assert.isAtLeast(body.data.length as number, 10)
    assert.equal((body.meta as { total: number }).total, 14)
  })

  test('listar usuarios como admin devuelve 200 y solo usuarios de su gym', async ({
    assert,
    client,
  }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym1.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    await UserFactory.merge({
      tenantId: gym1.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).createMany(5)
    await UserFactory.merge({
      tenantId: gym2.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).createMany(8)

    const response = await client.get('/api/users').loginAs(admin)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuarios listados correctamente',
    })
    assert.exists(body)
    assert.isArray(body.data)
    assert.equal(body.data.length, 6)
  })

  test('listar usuarios sin autenticación devuelve 401', async ({ assert, client }) => {
    const response = await client.get('/api/users')
    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [
        {
          message: 'Unauthorized access',
        },
      ],
    })
  })

  test('listar usuarios con paginación respeta page y perPage', async ({ assert, client }) => {
    const { superadminRole, adminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).createMany(5)

    const response = await client.get('/api/users').loginAs(superadmin).qs({ page: 1, perPage: 2 })

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuarios listados correctamente',
    })
    assert.isArray(body.data)
    assert.equal(body.data.length, 2)
    assert.equal((body.meta as { perPage: number }).perPage, 2)
    assert.equal((body.meta as { currentPage: number }).currentPage, 1)
  })
})

test.group('Mostrar datos de un usuario', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('mostrar datos de un usuario como superadmin', async ({ assert, client }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.get(`/api/users/${user.id}`).loginAs(superadmin)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario encontrado',
    })
    assert.exists(body.data)
    assert.equal(body.data.id, user.id)
    assert.equal(body.data.firstName, user.firstName)
    assert.equal(body.data.lastName, user.lastName)
  })

  test('mostrar datos de un usuario como admin del mismo gym', async ({ assert, client }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.get(`/api/users/${user.id}`).loginAs(admin)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario encontrado',
    })
    assert.equal(body.data.id, user.id)
    assert.equal(body.data.tenantId, gym.id)
  })

  test('admin no puede ver usuario de otro gym', async ({ assert, client }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym1.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const userOtroGym = await UserFactory.merge({
      tenantId: gym2.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.get(`/api/users/${userOtroGym.id}`).loginAs(admin)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No puedes ver usuarios de otro gym' }],
    })
  })

  test('usuario no encontrado devuelve 404', async ({ assert, client }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()
    await user.softDelete()

    const response = await client.get(`/api/users/${user.id}`).loginAs(superadmin)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Usuario no encontrado' }],
    })
  })

  test('mostrar usuario sin autenticación devuelve 401', async ({ assert, client }) => {
    const { receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.get(`/api/users/${user.id}`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Unauthorized access' }],
    })
  })

  test('id inválido devuelve 422', async ({ assert, client }) => {
    const { superadminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.get('/api/users/abc').loginAs(superadmin)

    response.assertStatus(422)
    const body = response.body()
    assert.exists(body)
    assert.isArray((body as { errors: unknown }).errors)
  })
})

test.group('Dar de baja usuario (destroy)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('superadmin puede dar de baja a un usuario (receptionist/trainer)', async ({
    assert,
    client,
  }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${user.id}`).loginAs(superadmin)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario dado de baja correctamente',
    })
    await user.refresh()
    assert.isNotNull(user.deletedAt)
  })

  test('admin puede dar de baja a un usuario de su mismo gym', async ({ assert, client }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${user.id}`).loginAs(admin)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario dado de baja correctamente',
    })
    await user.refresh()
    assert.isNotNull(user.deletedAt)
  })

  test('admin no puede dar de baja a usuario de otro gym', async ({ assert, client }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym1.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const userOtroGym = await UserFactory.merge({
      tenantId: gym2.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${userOtroGym.id}`).loginAs(admin)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No puedes dar de baja usuarios de otro gym' }],
    })
  })

  test('no se puede dar de baja a un superadmin', async ({ assert, client }) => {
    const { superadminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const otroSuperadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${otroSuperadmin.id}`).loginAs(superadmin)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No se puede dar de baja a este usuario' }],
    })
  })

  test('no se puede dar de baja a un admin sino eres superadmin', async ({ assert, client }) => {
    const { adminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const adminActual = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const adminTarget = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${adminTarget.id}`).loginAs(adminActual)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No se puede dar de baja a este usuario' }],
    })
  })

  test('dar de baja usuario sin autenticación devuelve 401', async ({ assert, client }) => {
    const { receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${user.id}`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Unauthorized access' }],
    })
  })

  test('id inválido devuelve 422', async ({ assert, client }) => {
    const { superadminRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete('/api/users/abc').loginAs(superadmin)

    response.assertStatus(422)
    const body = response.body()
    assert.exists(body)
    assert.isArray((body as { errors: unknown }).errors)
  })
})

test.group('Actualizar usuario (update)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('superadmin puede actualizar un usuario', async ({ assert, client }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(superadmin)
      .json({ firstName: 'Nombre', lastName: 'Actualizado', status: Status.INACTIVE })

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, { message: 'Usuario actualizado correctamente' })
    assert.equal(body.data.firstName, 'Nombre')
    assert.equal(body.data.lastName, 'Actualizado')
    assert.equal(body.data.status, Status.INACTIVE)
  })

  test('admin puede actualizar un usuario de su mismo gym', async ({ assert, client }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(admin)
      .json({ firstName: 'Recepcionista', lastName: 'Actualizado' })

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, { message: 'Usuario actualizado correctamente' })
    assert.equal(body.data.firstName, 'Recepcionista')
  })

  test('admin no puede actualizar usuario de otro gym', async ({ client }) => {
    const { adminRole, receptionistRole } = await createRoles()
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      tenantId: gym1.id,
      roleId: adminRole.id,
      status: Status.ACTIVE,
    }).create()
    const userOtroGym = await UserFactory.merge({
      tenantId: gym2.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${userOtroGym.id}`)
      .loginAs(admin)
      .json({ firstName: 'No debería actualizar' })

    response.assertStatus(404)
  })

  test('actualizar usuario con contraseña', async ({ assert, client }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(superadmin)
      .json({ password: 'nuevaClave123' })

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, { message: 'Usuario actualizado correctamente' })
    assert.exists(body.data)
    const updatedUser = await User.find(user.id)
    assert.exists(updatedUser)
    const ok = await import('@adonisjs/core/services/hash').then((h) =>
      h.default.verify(updatedUser!.passwordHash, 'nuevaClave123')
    )
    assert.isTrue(ok)
  })

  test('actualizar usuario sin autenticación devuelve 401', async ({ assert, client }) => {
    const { receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client.patch(`/api/users/${user.id}`).json({ firstName: 'Sin auth' })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Unauthorized access' }] })
  })

  test('actualizar con email inválido devuelve 422', async ({ assert, client }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(superadmin)
      .json({ email: 'no-es-email' })

    response.assertStatus(422)
    const body = response.body()
    assert.exists(body)
    assert.isArray((body as { errors: unknown }).errors)
  })

  test('actualizar con rol inválido devuelve 422', async ({ assert, client }) => {
    const { superadminRole, receptionistRole } = await createRoles()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      tenantId: gym.id,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      tenantId: gym.id,
      roleId: receptionistRole.id,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(superadmin)
      .json({ role: 'rol_invalido' })

    response.assertStatus(422)
    const body = response.body()
    assert.exists(body)
    assert.isArray((body as { errors: unknown }).errors)
  })
})
