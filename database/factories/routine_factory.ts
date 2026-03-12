import factory from '@adonisjs/lucid/factories'
import Routine from '#models/routine'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

const GOALS = [
  'Pérdida de peso',
  'Ganancia muscular',
  'Resistencia cardiovascular',
  'Flexibilidad',
  'Rehabilitación',
  'Mantenimiento físico',
  'Preparación deportiva',
]

export const RoutineFactory = factory
  .define(Routine, ({ faker }) => {
    const startDate = DateTime.now()
    return {
      tenantId: 1,
      clientId: 1,
      trainerId: null,
      name: `Rutina ${faker.helpers.arrayElement(['A', 'B', 'C'])} - ${faker.helpers.arrayElement(GOALS)}`,
      goal: faker.helpers.arrayElement(GOALS),
      status: Status.ACTIVE,
      startDate,
      endDate: startDate.plus({ days: 90 }),
      notes: null,
      createdBy: null,
    }
  })
  .build()
