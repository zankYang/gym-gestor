import factory from '@adonisjs/lucid/factories'
import Trainer from '#models/trainer'
import { Status } from '#enums/status_enum'

const SPECIALTIES = [
  'Musculación',
  'Cardio',
  'CrossFit',
  'Yoga',
  'Pilates',
  'Natación',
  'Artes marciales',
  'Spinning',
  'Funcional',
  'Rehabilitación',
]

export const TrainerFactory = factory
  .define(Trainer, ({ faker }) => {
    return {
      tenantId: 1,
      userId: null,
      branchId: null,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number({ style: 'international' }),
      specialty: faker.helpers.arrayElement(SPECIALTIES),
      status: Status.ACTIVE,
      notes: null,
    }
  })
  .build()
