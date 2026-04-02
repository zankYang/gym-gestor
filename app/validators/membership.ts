import vine from '@vinejs/vine'
import { Status } from '#enums/status_enum'

const tenantId = () => vine.number().exists({ table: 'tenants', column: 'id' })

const membershipStatusEnum = () =>
  vine.string().in([Status.PENDING, Status.ACTIVE, Status.EXPIRED, Status.CANCELLED, Status.FROZEN])

const moneyString = () =>
  vine
    .string()
    .trim()
    .regex(/^\d+(\.\d{2})$/)

export const createMembershipValidator = vine.create({
  tenantId: tenantId().optional(),

  clientId: vine.number().exists({ table: 'clients', column: 'id' }),
  membershipPlanId: vine.number().exists({ table: 'membership_plans', column: 'id' }),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),

  startDate: vine.date(),
  endDate: vine.date(),

  status: membershipStatusEnum().optional(),

  priceAtPurchase: moneyString(),
  discountAmount: moneyString(),
  finalAmount: moneyString(),

  autoRenew: vine.boolean().optional(),
  frozenDaysUsed: vine.number().min(0).optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const updateMembershipValidator = vine.create({
  tenantId: tenantId().optional(),

  clientId: vine.number().exists({ table: 'clients', column: 'id' }).optional(),
  membershipPlanId: vine.number().exists({ table: 'membership_plans', column: 'id' }).optional(),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),

  startDate: vine.date().optional(),
  endDate: vine.date().optional(),

  status: membershipStatusEnum().optional(),

  priceAtPurchase: moneyString().optional(),
  discountAmount: moneyString().optional(),
  finalAmount: moneyString().optional(),

  autoRenew: vine.boolean().optional(),
  frozenDaysUsed: vine.number().min(0).optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const listMembershipsQueryValidator = vine.create({
  page: vine.number().optional(),
  perPage: vine.number().optional(),
  q: vine.string().trim().maxLength(100).optional(),
  status: membershipStatusEnum().optional(),
  clientId: vine.number().optional(),
  sortBy: vine.string().trim().maxLength(50).optional(),
  sortDir: vine.string().in(['asc', 'desc']).optional(),
})

export const tenantIdQueryValidator = vine.create({
  tenantId: tenantId().optional(),
})
