import vine from '@vinejs/vine'
import { Status } from '#enums/status_enum'

const firstName = () => vine.string().trim().minLength(1).maxLength(100)
const lastName = () => vine.string().trim().minLength(1).maxLength(100)
const phone = () => vine.string().trim().minLength(1).maxLength(30)
const email = () => vine.string().email().maxLength(150)
const gender = () => vine.string().trim().minLength(1).maxLength(30)
const tenantId = () => vine.number().exists({ table: 'tenants', column: 'id' })
const branchId = () => vine.number().exists({ table: 'branches', column: 'id' })

const statusEnum = () => vine.string().in([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED])

export const createClientValidator = vine.create({
  tenantId: tenantId().optional(),
  branchId: branchId().optional(),

  firstName: firstName(),
  lastName: lastName(),
  phone: phone(),

  email: email().optional(),
  gender: gender().optional(),

  birthDate: vine.date().optional(),

  emergencyContactName: vine.string().trim().maxLength(150).optional(),
  emergencyContactPhone: vine.string().trim().maxLength(30).optional(),
  medicalNotes: vine.string().trim().optional(),
  notes: vine.string().trim().optional(),

  status: statusEnum().optional(),
})

export const updateClientValidator = vine.create({
  tenantId: tenantId().optional(),
  branchId: branchId().optional(),

  firstName: firstName().optional(),
  lastName: lastName().optional(),
  phone: phone().optional(),

  email: email().optional(),
  gender: gender().optional(),
  birthDate: vine.date().optional(),

  emergencyContactName: vine.string().trim().maxLength(150).optional(),
  emergencyContactPhone: vine.string().trim().maxLength(30).optional(),
  medicalNotes: vine.string().trim().optional(),
  notes: vine.string().trim().optional(),

  status: statusEnum().optional(),
})
