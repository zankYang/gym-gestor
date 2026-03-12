import factory from '@adonisjs/lucid/factories'
import ClientMembership from '#models/client_membership'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export const ClientMembershipFactory = factory
  .define(ClientMembership, ({ faker }) => {
    const startDate = DateTime.fromJSDate(faker.date.recent({ days: 60 }))
    const endDate = startDate.plus({ days: 30 })
    const price = faker.commerce.price({ min: 20, max: 200 })
    return {
      tenantId: 1,
      clientId: 1,
      membershipPlanId: 1,
      branchId: null,
      startDate,
      endDate,
      status: Status.ACTIVE,
      priceAtPurchase: price,
      discountAmount: '0',
      finalAmount: price,
      autoRenew: false,
      frozenDaysUsed: 0,
      notes: null,
      createdBy: 1,
    }
  })
  .build()
