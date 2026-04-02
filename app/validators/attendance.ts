import vine from '@vinejs/vine'
import { Status } from '#enums/status_enum'

const tenantId = () => vine.number().exists({ table: 'tenants', column: 'id' })

const attendanceStatusEnum = () =>
  vine.string().in([Status.CHECKED_IN, Status.CHECKED_OUT, Status.DENIED])

export const createAttendanceValidator = vine.create({
  tenantId: tenantId().optional(),
  clientId: vine.number().exists({ table: 'clients', column: 'id' }),
  clientMembershipId: vine
    .number()
    .exists({ table: 'client_memberships', column: 'id' })
    .optional()
    .nullable(),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),
  attendanceDate: vine.date().optional(),
  checkInAt: vine.date().optional(),
  checkOutAt: vine.date().optional().nullable(),
  status: attendanceStatusEnum().optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const updateAttendanceValidator = vine.create({
  tenantId: tenantId().optional(),
  clientId: vine.number().exists({ table: 'clients', column: 'id' }).optional(),
  clientMembershipId: vine
    .number()
    .exists({ table: 'client_memberships', column: 'id' })
    .optional()
    .nullable(),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),
  attendanceDate: vine.date().optional(),
  checkInAt: vine.date().optional(),
  checkOutAt: vine.date().optional().nullable(),
  status: attendanceStatusEnum().optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const checkInValidator = vine.create({
  tenantId: tenantId().optional(),
  clientId: vine.number().exists({ table: 'clients', column: 'id' }),
  clientMembershipId: vine
    .number()
    .exists({ table: 'client_memberships', column: 'id' })
    .optional()
    .nullable(),
  branchId: vine.number().exists({ table: 'branches', column: 'id' }).optional().nullable(),
  checkInAt: vine.date().optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const checkOutValidator = vine.create({
  checkOutAt: vine.date().optional(),
  notes: vine.string().trim().maxLength(5000).optional().nullable(),
})

export const listAttendancesQueryValidator = vine.create({
  page: vine.number().optional(),
  perPage: vine.number().optional(),
  q: vine.string().trim().maxLength(100).optional(),
  status: attendanceStatusEnum().optional(),
  clientId: vine.number().optional(),
  branchId: vine.number().optional(),
  dateFrom: vine.date().optional(),
  dateTo: vine.date().optional(),
  sortBy: vine.string().trim().maxLength(50).optional(),
  sortDir: vine.string().in(['asc', 'desc']).optional(),
})

export const tenantIdQueryValidator = vine.create({
  tenantId: tenantId().optional(),
})
