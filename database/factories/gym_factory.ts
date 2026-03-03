import factory from '@adonisjs/lucid/factories'
import Gym from '#models/gym'

export const GymFactory = factory
  .define(Gym, async ({ faker }) => {
    const name = faker.company.name()
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      logoUrl: faker.image.url(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      accentColor: faker.color.rgb(),
      email: faker.internet.email(),
      phone: faker.phone.number({ style: 'international' }),
      address: faker.location.streetAddress(),
      status: faker.helpers.arrayElement(['active', 'inactive']),
    }
  })
  .build()
