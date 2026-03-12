import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import Role from '#models/role'
import { RoleCode } from '#enums/role_enum'

test.group('Auth', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('login con credenciales correctas', async ({ assert, client }) => {
    const role = await Role.create({
        name: RoleCode.ADMIN,
        code: RoleCode.ADMIN,
        description: 'Administrador del gimnasio, acceso completo dentro del tenant',
      }
    )
    await UserFactory.with('tenant')
      .merge({ tenantId: 123, roleId: role.id, email: 'test@test.com', passwordHash: '12345678' })
      .create()
    const response = await client.post('/api/auth/login').json({
      email: 'test@test.com',
      password: '12345678',
    })

    response.assertStatus(200)
    assert.deepInclude(response.body(), {
      message: 'Conectado correctamente',
    })
  })
})
