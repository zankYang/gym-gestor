import vine from '@vinejs/vine'
import { Status } from '#enums/status_enum'

const tenantId = () => vine.number().exists({ table: 'tenants', column: 'id' })

const statusEnum = () => vine.string().in([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED])

const name = () => vine.string().trim().minLength(1).maxLength(120)
const code = () => vine.string().trim().minLength(1).maxLength(50)
const description = () => vine.string().trim().maxLength(2000).optional()

const durationDays = () => vine.number().min(1)

// La BD usa decimal(10,2) pero en la API/seed parece manejarse como string.
const price = () =>
  vine
    .string()
    .trim()
    .regex(/^\d+(\.\d{2})$/)
// requerido en create; opcional en update mediante `.optional()` del validador

const positiveIntOrZero = () => vine.number().min(0)

const booleanFlag = () => vine.boolean()

export const createPlanValidator = vine.create({
  tenantId: tenantId().optional(),

  name: name(),
  code: code(),
  description: description(),

  durationDays: durationDays(),
  price: price(),

  allowsClasses: booleanFlag().optional(),
  allowsFreeze: booleanFlag().optional(),
  freezeDaysLimit: positiveIntOrZero().optional(),

  status: statusEnum().optional(),
})

export const updatePlanValidator = vine.create({
  tenantId: tenantId().optional(),

  name: name().optional(),
  code: code().optional(),
  description: description(),

  durationDays: durationDays().optional(),
  price: price().optional(),

  allowsClasses: booleanFlag().optional(),
  allowsFreeze: booleanFlag().optional(),
  freezeDaysLimit: positiveIntOrZero().optional(),

  status: statusEnum().optional(),
})

export const listPlansQueryValidator = vine.create({
  page: vine.number().optional(),
  perPage: vine.number().optional(),
  q: vine.string().trim().maxLength(100).optional(),
  status: statusEnum().optional(),
  sortBy: vine.string().trim().maxLength(50).optional(),
  sortDir: vine.string().in(['asc', 'desc']).optional(),
})

export const tenantIdQueryValidator = vine.create({
  tenantId: tenantId().optional(),
})
