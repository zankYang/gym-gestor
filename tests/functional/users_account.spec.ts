import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { Role } from '#enums/role_enum'
import { GymFactory } from '#database/factories/gym_factory'
import { Status } from '#enums/status_enum'
import User from '#models/user'

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

test.group('Creacion de administradores', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  test('crear un admin desde el superadmin', async ({ assert, client }) => {
    const superadmin = await UserFactory.merge({ gymId: null, role: Role.SUPERADMIN }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).make()

    const response = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({ ...admin.toJSON(), password: '12345678', passwordConfirmation: '12345678' })

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario creado correctamente',
    })
    const createdAdmin = await User.find(body.data.id)
    assert.exists(createdAdmin)
  })

  test('crear un admin sin ser superadmin', async ({ assert, client }) => {
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({ gymId: gym.id, role: Role.ADMIN }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).make()

    const responseAdmin = await client
      .post('/api/users')
      .loginAs(admin)
      .json({ ...user.toJSON(), password: '12345678', passwordConfirmation: '12345678' })
    const responseUser = await client
      .post('/api/users')
      .json({ ...user.toJSON(), password: '12345678', passwordConfirmation: '12345678' })

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
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({ gymId: null, role: Role.SUPERADMIN }).create()
    const admin = await UserFactory.merge({ gymId: gym.id, role: Role.ADMIN }).create()

    const response = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({ ...admin.toJSON(), password: '12345678', passwordConfirmation: '12345678' })

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
    const superadmin = await UserFactory.merge({ gymId: null, role: Role.SUPERADMIN }).create()
    const payload = {
      fullName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      role: '',
      gymId: null,
    }

    const responseNull = await client.post('/api/users').loginAs(superadmin).json({})
    const responseInvalidEmail = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({ ...payload, email: 'admin' })
    const responseInvalidRole = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({ ...payload, role: 'invalid' })
    const responseInvalidGymId = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({ ...payload, gymId: 2123 })
    const responseInvalidPassConfirmation = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({
        ...payload,
        password: '12345678',
        passwordConfirmation: '123456789',
      })

    responseNull.assertStatus(422)
    responseInvalidEmail.assertStatus(422)
    responseInvalidRole.assertStatus(422)
    responseInvalidGymId.assertStatus(422)
    responseInvalidPassConfirmation.assertStatus(422)
    const bodyNull = responseNull.body()! as ResponseError
    const bodyInvalidEmail = responseInvalidEmail.body()! as ResponseError
    const bodyInvalidRole = responseInvalidRole.body()! as ResponseError
    const bodyInvalidGymId = responseInvalidGymId.body()! as ResponseError
    const bodyInvalidPassConfirmation = responseInvalidPassConfirmation.body()! as ResponseError

    const nullMessages = [
      'Nombre completo es obligatorio',
      'Email es obligatorio',
      'Rol es obligatorio',
      'Gimnasio es obligatorio',
      'Contraseña es obligatorio',
      'Confirmación de contraseña es obligatorio',
    ].sort()
    const actualMessages = bodyNull.errors.map((e) => e.message).sort()
    assert.deepEqual(actualMessages, nullMessages)

    const invalidEmailMessages = [
      'Nombre completo es obligatorio',
      'El correo electrónico no es válido',
      'Rol es obligatorio',
      'Gimnasio es obligatorio',
      'Contraseña es obligatorio',
      'Confirmación de contraseña es obligatorio',
    ].sort()
    const actualInvalidEmailMessages = bodyInvalidEmail.errors.map((e) => e.message).sort()
    assert.deepEqual(actualInvalidEmailMessages, invalidEmailMessages)

    const invalidRolMessages = [
      'Nombre completo es obligatorio',
      'Email es obligatorio',
      'Rol no es válido',
      'Gimnasio es obligatorio',
      'Contraseña es obligatorio',
      'Confirmación de contraseña es obligatorio',
    ].sort()
    const actualInvalidRolMessages = bodyInvalidRole.errors.map((e) => e.message).sort()
    assert.deepEqual(actualInvalidRolMessages, invalidRolMessages)

    const invalidGymIdMessages = [
      'Nombre completo es obligatorio',
      'Email es obligatorio',
      'Rol es obligatorio',
      'Gimnasio no existe o no es válido',
      'Contraseña es obligatorio',
      'Confirmación de contraseña es obligatorio',
    ].sort()
    const actualInvalidGymIdMessages = bodyInvalidGymId.errors.map((e) => e.message).sort()
    assert.deepEqual(actualInvalidGymIdMessages, invalidGymIdMessages)

    const invalidPassConfirmationMessages = [
      'Nombre completo es obligatorio',
      'Email es obligatorio',
      'Rol es obligatorio',
      'Gimnasio es obligatorio',
      'El valor no coincide, favor de verificar',
    ].sort()
    const actualInvalidPassConfirmationMessages = bodyInvalidPassConfirmation.errors
      .map((e) => e.message)
      .sort()
    assert.deepEqual(actualInvalidPassConfirmationMessages, invalidPassConfirmationMessages)
  })
})

test.group('Creacion de usuarios', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  test('crear un usuario desde el admin y superadmin', async ({ assert, client }) => {
    const superadmin = await UserFactory.merge({ gymId: null, role: Role.SUPERADMIN }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({ gymId: gym.id, role: Role.ADMIN }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).makeMany(2)

    const responseSuperadmin = await client
      .post('/api/users')
      .loginAs(superadmin)
      .json({ ...user[0].toJSON(), password: '12345678', passwordConfirmation: '12345678' })
    const responseAdmin = await client
      .post('/api/users')
      .loginAs(admin)
      .json({ ...user[1].toJSON(), password: '12345678', passwordConfirmation: '12345678' })

    responseSuperadmin.assertStatus(201)
    responseAdmin.assertStatus(201)
    const bodySuperadmin = responseSuperadmin.body()! as Response
    const bodyAdmin = responseAdmin.body()! as Response
    const createdSuperadmin = await User.find(bodySuperadmin.data.id)
    const createdAdmin = await User.find(bodyAdmin.data.id)
    assert.deepInclude(bodySuperadmin, {
      message: 'Usuario creado correctamente',
    })
    assert.deepInclude(bodyAdmin, {
      message: 'Usuario creado correctamente',
    })
    assert.exists(createdSuperadmin)
    assert.exists(createdAdmin)
  })

  test('crear un usuario sin ser superadmin o admin', async ({ assert, client }) => {
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.TRAINER,
      status: Status.ACTIVE,
    }).makeMany(2)
    await user[0].save()

    const response = await client
      .post('/api/users')
      .loginAs(user[0])
      .json({ ...user[1].toJSON(), password: '12345678', passwordConfirmation: '12345678' })

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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    await UserFactory.merge({ gymId: gym.id, role: Role.ADMIN }).createMany(5)
    await UserFactory.merge({ gymId: gym.id, role: Role.RECEPTIONIST }).createMany(8)

    const response = await client.get('/api/users').loginAs(superadmin).qs({ gymId: gym.id })

    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuarios listados correctamente',
    })
    assert.exists(body)
    assert.isArray(body.data)
    assert.isAtLeast(body.data.length as number, 10)
    assert.equal((body.meta as { total: number }).total, 13)
  })

  test('listar usuarios como admin devuelve 200 y solo usuarios de su gym', async ({
    assert,
    client,
  }) => {
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym1.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    await UserFactory.merge({
      gymId: gym1.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).createMany(5)
    await UserFactory.merge({
      gymId: gym2.id,
      role: Role.RECEPTIONIST,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    assert.equal(body.data.fullName, user.fullName)
  })

  test('mostrar datos de un usuario como admin del mismo gym', async ({ assert, client }) => {
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).create()

    const response = await client.get(`/api/users/${user.id}`).loginAs(admin)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, {
      message: 'Usuario encontrado',
    })
    assert.equal(body.data.id, user.id)
    assert.equal(body.data.gymId, gym.id)
  })

  test('admin no puede ver usuario de otro gym', async ({ assert, client }) => {
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym1.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const userOtroGym = await UserFactory.merge({
      gymId: gym2.id,
      role: Role.RECEPTIONIST,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym1.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const userOtroGym = await UserFactory.merge({
      gymId: gym2.id,
      role: Role.RECEPTIONIST,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const otroSuperadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
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
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const superadmin = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const admin = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()

    const response = await client.delete(`/api/users/${admin.id}`).loginAs(superadmin)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No se puede dar de baja a este usuario' }],
    })
  })

  test('dar de baja usuario sin autenticación devuelve 401', async ({ assert, client }) => {
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(superadmin)
      .json({ fullName: 'Nombre actualizado', status: Status.INACTIVE })

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, { message: 'Usuario actualizado correctamente' })
    assert.equal(body.data.fullName, 'Nombre actualizado')
    assert.equal(body.data.status, Status.INACTIVE)
  })

  test('admin puede actualizar un usuario de su mismo gym', async ({ assert, client }) => {
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${user.id}`)
      .loginAs(admin)
      .json({ fullName: 'Recepcionista actualizado' })

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepInclude(body, { message: 'Usuario actualizado correctamente' })
    assert.equal(body.data.fullName, 'Recepcionista actualizado')
  })

  test('admin no puede actualizar usuario de otro gym', async ({ client }) => {
    const gym1 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const gym2 = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const admin = await UserFactory.merge({
      gymId: gym1.id,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }).create()
    const userOtroGym = await UserFactory.merge({
      gymId: gym2.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).create()

    const response = await client
      .patch(`/api/users/${userOtroGym.id}`)
      .loginAs(admin)
      .json({ fullName: 'No debería actualizar' })

    response.assertStatus(404)
  })

  test('actualizar usuario con contraseña', async ({ assert, client }) => {
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
      h.default.verify(updatedUser!.password, 'nuevaClave123')
    )
    assert.isTrue(ok)
  })

  test('actualizar usuario sin autenticación devuelve 401', async ({ assert, client }) => {
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
      status: Status.ACTIVE,
    }).create()

    const response = await client.patch(`/api/users/${user.id}`).json({ fullName: 'Sin auth' })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Unauthorized access' }] })
  })

  test('actualizar con email inválido devuelve 422', async ({ assert, client }) => {
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
    const superadmin = await UserFactory.merge({
      gymId: null,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    }).create()
    const gym = await GymFactory.merge({ status: Status.ACTIVE }).create()
    const user = await UserFactory.merge({
      gymId: gym.id,
      role: Role.RECEPTIONIST,
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
