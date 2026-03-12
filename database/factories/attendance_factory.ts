import factory from '@adonisjs/lucid/factories'
import Attendance from '#models/attendance'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export const AttendanceFactory = factory
  .define(Attendance, ({ faker }) => {
    const attendanceDate = DateTime.fromJSDate(faker.date.recent({ days: 30 }))
    const checkInAt = attendanceDate.set({
      hour: faker.number.int({ min: 6, max: 21 }),
      minute: faker.number.int({ min: 0, max: 59 }),
    })
    return {
      tenantId: 1,
      clientId: 1,
      clientMembershipId: null,
      branchId: null,
      attendanceDate,
      checkInAt,
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: 1,
      notes: null,
    }
  })
  .build()
