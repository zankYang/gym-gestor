import factory from '@adonisjs/lucid/factories'
import ClassSchedule from '#models/class_schedule'
import { Status } from '#enums/status_enum'

export const ClassScheduleFactory = factory
  .define(ClassSchedule, ({ faker }) => {
    const hour = faker.number.int({ min: 6, max: 20 })
    const startTime = `${String(hour).padStart(2, '0')}:00:00`
    const endTime = `${String(hour + 1).padStart(2, '0')}:00:00`
    return {
      tenantId: 1,
      classId: 1,
      dayOfWeek: faker.number.int({ min: 1, max: 7 }),
      startTime,
      endTime,
      roomName: `Sala ${faker.helpers.arrayElement(['A', 'B', 'C', '1', '2'])}`,
      status: Status.ACTIVE,
    }
  })
  .build()
