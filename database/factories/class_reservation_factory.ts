import factory from '@adonisjs/lucid/factories'
import ClassReservation from '#models/class_reservation'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export const ClassReservationFactory = factory
  .define(ClassReservation, ({ faker }) => {
    return {
      tenantId: 1,
      classScheduleId: 1,
      clientId: 1,
      reservationDate: DateTime.fromJSDate(faker.date.soon({ days: 14 })),
      status: Status.RESERVED,
      notes: null,
    }
  })
  .build()
