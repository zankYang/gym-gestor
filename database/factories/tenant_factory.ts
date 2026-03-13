import factory from '@adonisjs/lucid/factories'
import Tenant from '#models/tenant'
import { Status } from '#enums/status_enum'

export const TenantFactory = factory
  .define(Tenant, async ({ faker }) => {
    const name = faker.company.name()
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      logoUrl: faker.image.url(),
      banner: faker.image.url(),
      backgroundImageUrl: faker.image.url(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      email: faker.internet.email(),
      phone: faker.phone.number({ style: 'international' }),
      address: faker.location.streetAddress(),
      status: faker.helpers.arrayElement([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED]),
      config: {
        currency: faker.helpers.arrayElement(['MXN', 'USD']),
        timezone: faker.helpers.arrayElement([
          'America/Mexico_City',
          'America/Puebla',
          'America/Guatemala',
          'America/Panama',
          'America/Caracas',
          'America/Bogota',
          'America/Lima',
          'America/Santiago',
          'America/Sao_Paulo',
        ]),
        locale: faker.helpers.arrayElement(['es-MX', 'en-US']),
        invoicePrefix: faker.string.alphanumeric(3),
        branchCodePrefix: faker.string.alphanumeric(3),
        taxRate: faker.number.float({ min: 0, max: 1 }),
        cancellationHoursLimit: faker.number.int({ min: 1, max: 24 }),
      },
    }
  })
  .build()
