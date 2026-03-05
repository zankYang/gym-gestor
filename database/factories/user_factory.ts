import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { Role } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const password = await hash.make(faker.internet.password())
    return {
      gymId: 1,
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password,
      role: faker.helpers.enumValue(Role),
      status: faker.helpers.enumValue(Status),
    }
  })
  .build()
