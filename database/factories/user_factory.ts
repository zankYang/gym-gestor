import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { Status } from '#enums/status_enum'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const passwordHash = await hash.make(faker.internet.password())
    return {
      tenantId: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash,
      roleId: 1,
      status: faker.helpers.arrayElement([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED]),
    }
  })
  .build()
