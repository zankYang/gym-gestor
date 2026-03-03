import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

test.group('New account (signup)', () => {
  test('guarda el usuario registrado en la base de datos', async ({ assert, client }) => {
    const unique = Date.now()
    await db
      .connection()
      .table('gyms')
      .insert({
        name: 'Gym Test',
        slug: `gym-test-${unique}`,
        status: 'active',
      })

    const payload = {
      fullName: 'Usuario Prueba',
      email: `signup-test-${unique}@example.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
    }

    const response = await client.post('/api/auth/signup').json(payload)

    response.assertStatus(200)
    const body = response.body()
    assert.isDefined(body.data, 'La respuesta debe incluir data (serializer)')
    assert.isDefined(body.data.token)
    assert.isDefined(body.data.user)
    assert.equal(body.data.user.fullName, payload.fullName)
    assert.equal(body.data.user.email, payload.email)

    const userInDb = await User.query().where('email', payload.email).first()
    assert.isNotNull(userInDb)
    assert.equal(userInDb!.fullName, payload.fullName)
    assert.equal(userInDb!.email, payload.email)
    assert.isTrue(userInDb!.password.length > 0)
    assert.equal(userInDb!.role, 'receptionist')
    assert.equal(userInDb!.status, 'active')
  })
})
