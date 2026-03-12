import factory from '@adonisjs/lucid/factories'
import MembershipPlan from '#models/membership_plan'
import { PlanType } from '#enums/plan_type_enum'
import { Status } from '#enums/status_enum'

const PLAN_TYPES = [
  {
    name: PlanType.VISIT,
    durationDays: 1,
    priceMin: 5,
    priceMax: 15,
    allowsClasses: false,
    allowsFreeze: false,
    freezeDaysLimit: 0,
  },
  {
    name: PlanType.WEEKLY,
    durationDays: 7,
    priceMin: 10,
    priceMax: 30,
    allowsClasses: false,
    allowsFreeze: false,
    freezeDaysLimit: 0,
  },
  {
    name: PlanType.MONTHLY,
    durationDays: 30,
    priceMin: 30,
    priceMax: 80,
    allowsClasses: false,
    allowsFreeze: true,
    freezeDaysLimit: 5,
  },
  {
    name: PlanType.MONTHLY_CLASSES,
    durationDays: 30,
    priceMin: 50,
    priceMax: 100,
    allowsClasses: true,
    allowsFreeze: true,
    freezeDaysLimit: 5,
  },
  {
    name: PlanType.QUARTERLY,
    durationDays: 90,
    priceMin: 80,
    priceMax: 200,
    allowsClasses: false,
    allowsFreeze: true,
    freezeDaysLimit: 10,
  },
  {
    name: PlanType.SEMIANNUAL,
    durationDays: 180,
    priceMin: 140,
    priceMax: 350,
    allowsClasses: true,
    allowsFreeze: true,
    freezeDaysLimit: 15,
  },
  {
    name: PlanType.ANNUAL,
    durationDays: 365,
    priceMin: 250,
    priceMax: 600,
    allowsClasses: true,
    allowsFreeze: true,
    freezeDaysLimit: 30,
  },
] as const

export const MembershipPlanFactory = factory
  .define(MembershipPlan, ({ faker }) => {
    const plan = faker.helpers.arrayElement(PLAN_TYPES)
    return {
      tenantId: 1,
      name: plan.name,
      code: faker.string.alphanumeric(8).toUpperCase(),
      description: faker.lorem.sentence(),
      durationDays: plan.durationDays,
      price: faker.commerce.price({ min: plan.priceMin, max: plan.priceMax }),
      allowsClasses: plan.allowsClasses,
      allowsFreeze: plan.allowsFreeze,
      freezeDaysLimit: plan.freezeDaysLimit,
      status: Status.ACTIVE,
    }
  })
  .build()
