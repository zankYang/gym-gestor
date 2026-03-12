import factory from '@adonisjs/lucid/factories'
import Payment from '#models/payment'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export const PaymentFactory = factory
  .define(Payment, ({ faker }) => {
    return {
      tenantId: 1,
      clientId: 1,
      clientMembershipId: null,
      paymentMethodId: 1,
      branchId: null,
      amount: faker.commerce.price({ min: 20, max: 200 }),
      paymentDate: DateTime.fromJSDate(faker.date.recent({ days: 30 })),
      reference: faker.string.alphanumeric(10).toUpperCase(),
      concept: faker.helpers.arrayElement([
        'Pago mensualidad',
        'Pago trimestral',
        'Renovación membresía',
        'Pago visita',
      ]),
      status: Status.PAID,
      notes: null,
      registeredBy: 1,
    }
  })
  .build()
