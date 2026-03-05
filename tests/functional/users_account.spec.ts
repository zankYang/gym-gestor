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
