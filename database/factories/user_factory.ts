import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const password = await hash.make(faker.internet.password())
    return {
      gymId: 1,
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password,
      role: faker.helpers.arrayElement(['superadmin', 'admin', 'receptionist', 'trainer']),
      status: faker.helpers.arrayElement(['active', 'inactive']),
    }
  })
  .build()
