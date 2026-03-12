import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import Role from '#models/role'
import { RoleCode } from '#enums/role_enum'
import Tenant from '#models/tenant'
import { TenantFactory } from '#factories/tenant_factory'

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

test.group('Auth', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('login con credenciales correctas', async ({ assert, client }) => {
    const role = await Role.create({
      name: RoleCode.ADMIN,
      code: RoleCode.ADMIN,
      description: 'Administrador del gimnasio, acceso completo dentro del tenant',
    })
    await UserFactory.with('tenant')
      .merge({ tenantId: 123, roleId: role.id, email: 'test@test.com', passwordHash: '12345678' })
      .create()
    const gyms = await Tenant.all()
    const response = await client
      .post('/api/auth/login')
      .header('Host', `${gyms[0].slug}.localhost:3333`)
      .json({
        email: 'test@test.com',
        password: '12345678',
      })
    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepEqual(body, {
      message: 'Conectado correctamente',
      data: {
        token: body.data.token,
      },
    })
  })

  test('login con credenciales incorrectas', async ({ assert, client }) => {
    const role = await Role.create({
      name: RoleCode.ADMIN,
      code: RoleCode.ADMIN,
      description: 'Administrador del gimnasio, acceso completo dentro del tenant',
    })

    await UserFactory.with('tenant')
      .merge({ tenantId: 123, roleId: role.id, email: 'test@test.com', passwordHash: '12345678' })
      .create()

    const gyms = await Tenant.all()
    const response = await client
      .post('/api/auth/login')
      .header('Host', `${gyms[0].slug}.localhost:3333`)
      .json({
        email: 'test@test.com',
        password: '12345679',
      })
    response.assertStatus(401)

    const bodyUser = response.body()! as ResponseError
    assert.deepEqual(bodyUser, {
      errors: [
        {
          message: 'El correo o la contraseña son incorrectos',
        },
      ],
    })
  })

  test('login en tenant diferente al del usuario', async ({ assert, client }) => {
    const role = await Role.create({
      name: RoleCode.ADMIN,
      code: RoleCode.ADMIN,
      description: 'Administrador del gimnasio, acceso completo dentro del tenant',
    })
    await UserFactory.with('tenant')
      .merge({ roleId: role.id, email: 'test@test.com', passwordHash: '12345678' })
      .create()
    await TenantFactory.merge({ slug: 'slug-falso' }).create()

    const response = await client.post('/api/auth/login').header('Host', `slug-falso`).json({
      email: 'test@test.com',
      password: '12345678',
    })
    response.assertStatus(401)
    const bodyUser = response.body()! as ResponseError
    assert.deepEqual(bodyUser, {
      errors: [
        {
          message: 'El correo o la contraseña son incorrectos',
        },
      ],
    })
  })

  test('logout', async ({ assert, client }) => {
    const role = await Role.create({
      name: RoleCode.ADMIN,
      code: RoleCode.ADMIN,
      description: 'Administrador del gimnasio, acceso completo dentro del tenant',
    })
    const user = await UserFactory.with('tenant')
      .merge({ roleId: role.id, email: 'test@test.com', passwordHash: '12345678' })
      .create()
    const gyms = await Tenant.all()
    const response = await client
      .post('/api/auth/logout')
      .header('Host', `${gyms[0].slug}.localhost:3333`)
      .loginAs(user)
    response.assertStatus(200)
    const body = response.body()! as Response
    assert.deepEqual(body, {
      message: 'Desconectado correctamente',
    })
  })
})
