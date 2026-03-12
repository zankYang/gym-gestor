import factory from '@adonisjs/lucid/factories'
import Client from '#models/client'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export const ClientFactory = factory
  .define(Client, ({ faker }) => {
    return {
      tenantId: 1,
      branchId: null,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number({ style: 'international' }),
      birthDate: DateTime.fromJSDate(faker.date.birthdate({ min: 18, max: 60, mode: 'age' })),
      gender: faker.helpers.arrayElement(['M', 'F', 'Otro']),
      emergencyContactName: faker.person.fullName(),
      emergencyContactPhone: faker.phone.number({ style: 'international' }),
      medicalNotes: null,
      notes: null,
      status: Status.ACTIVE,
      joinedAt: DateTime.now(),
      createdBy: 1,
    }
  })
  .build()
