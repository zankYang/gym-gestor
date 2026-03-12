import factory from '@adonisjs/lucid/factories'
import MembershipPlan from '#models/membership_plan'
import { Status } from '#enums/status_enum'

export const MembershipPlanFactory = factory
  .define(MembershipPlan, ({ faker }) => {
    const durationDays = faker.helpers.arrayElement([30, 60, 90, 180, 365])
    return {
      tenantId: 1,
      name: faker.helpers.arrayElement([
        'Plan Mensual',
        'Plan Trimestral',
        'Plan Semestral',
        'Plan Anual',
        'Plan Visita',
      ]),
      code: faker.string.alphanumeric(8).toUpperCase(),
      description: faker.lorem.sentence(),
      durationDays,
      price: faker.commerce.price({ min: 20, max: 200 }),
      allowsClasses: faker.datatype.boolean(),
      allowsFreeze: faker.datatype.boolean(),
      freezeDaysLimit: faker.number.int({ min: 0, max: 30 }),
      status: Status.ACTIVE,
    }
  })
  .build()
