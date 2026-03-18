import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { Status } from '#enums/status_enum'
import { TenantFactory } from '#factories/tenant_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      tenantId: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash: '12345678',
      avatarUrl: faker.image.url(),
      roleId: 1,
      status: faker.helpers.arrayElement([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED]),
    }
  })
  .relation('tenant', () => TenantFactory)
  .build()
