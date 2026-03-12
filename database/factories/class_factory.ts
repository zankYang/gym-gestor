import factory from '@adonisjs/lucid/factories'
import GymClass from '#models/class'
import { Status } from '#enums/status_enum'

const CLASS_NAMES = [
  'Spinning',
  'Yoga',
  'Pilates',
  'Zumba',
  'CrossFit',
  'HIIT',
  'Body Pump',
  'GAP',
  'Boxeo',
  'Funcional',
  'Stretching',
  'Cardio Dance',
]

export const ClassFactory = factory
  .define(GymClass, ({ faker }) => {
    return {
      tenantId: 1,
      branchId: null,
      trainerId: null,
      name: faker.helpers.arrayElement(CLASS_NAMES),
      description: faker.lorem.sentence(),
      capacity: faker.number.int({ min: 5, max: 30 }),
      durationMinutes: faker.helpers.arrayElement([30, 45, 60, 90]),
      status: Status.ACTIVE,
    }
  })
  .build()
