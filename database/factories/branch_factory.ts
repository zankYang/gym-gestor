import factory from '@adonisjs/lucid/factories'
import Branch from '#models/branch'
import { Status } from '#enums/status_enum'

export const BranchFactory = factory
  .define(Branch, ({ faker }) => {
    return {
      tenantId: 1,
      name: faker.company.name(),
      code: faker.string.alphanumeric(6).toUpperCase(),
      phone: faker.phone.number({ style: 'international' }),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      status: Status.ACTIVE,
    }
  })
  .build()
