import vine from '@vinejs/vine'
import { Status } from '#enums/status_enum'

const tenantId = () => vine.number().exists({ table: 'tenants', column: 'id' })

const paymentStatusEnum = () =>
  vine.string().in([Status.PAID, Status.PENDING, Status.CANCELLED, Status.REFUNDED])

const moneyString = () =>
  vine
    .string()
    .trim()
    .regex(/^\d+(\.\d{2})$/)

export const createPaymentValidator = vine.create({
  tenantId: tenantId().optional(),

  clientId: vine.number().exists({ table: 'clients', column: 'id' }),
  clientMembershipId: vine
    .number()
    .exists({ table: 'client_memberships', column: 'id' })
    .optional()
    .nullable(),
  paymentMethodId: vine.number().exists({ table: 'payment_methods', column: 'id' }),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),

  amount: moneyString(),
  paymentDate: vine.date().optional(),
  reference: vine.string().trim().maxLength(150).optional().nullable(),
  concept: vine.string().trim().minLength(2).maxLength(50),
  status: paymentStatusEnum().optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const updatePaymentValidator = vine.create({
  tenantId: tenantId().optional(),

  clientId: vine.number().exists({ table: 'clients', column: 'id' }).optional(),
  clientMembershipId: vine
    .number()
    .exists({ table: 'client_memberships', column: 'id' })
    .optional()
    .nullable(),
  paymentMethodId: vine.number().exists({ table: 'payment_methods', column: 'id' }).optional(),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),

  amount: moneyString().optional(),
  paymentDate: vine.date().optional(),
  reference: vine.string().trim().maxLength(150).optional().nullable(),
  concept: vine.string().trim().minLength(2).maxLength(50).optional(),
  status: paymentStatusEnum().optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const cancelPaymentValidator = vine.create({
  reason: vine.string().trim().minLength(3).maxLength(500),
  status: vine.string().in([Status.CANCELLED, Status.REFUNDED]).optional(),
})

export const listPaymentsQueryValidator = vine.create({
  page: vine.number().optional(),
  perPage: vine.number().optional(),
  q: vine.string().trim().maxLength(100).optional(),
  status: paymentStatusEnum().optional(),
  clientId: vine.number().optional(),
  paymentMethodId: vine.number().optional(),
  dateFrom: vine.date().optional(),
  dateTo: vine.date().optional(),
  sortBy: vine.string().trim().maxLength(50).optional(),
  sortDir: vine.string().in(['asc', 'desc']).optional(),
})

export const tenantIdQueryValidator = vine.create({
  tenantId: tenantId().optional(),
})
