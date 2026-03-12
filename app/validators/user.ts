import vine from '@vinejs/vine'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

const firstName = () => vine.string().trim().minLength(1).maxLength(100)
const lastName = () => vine.string().trim().minLength(1).maxLength(100)
const email = () => vine.string().email().maxLength(150)
const password = () => vine.string().minLength(8).maxLength(20)
const roleEnum = () => vine.string().in([RoleCode.ADMIN, RoleCode.RECEPTIONIST, RoleCode.COACH])
const statusEnum = () => vine.string().in([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED])
const id = () => vine.number().exists({ table: 'users', column: 'id' })

/**
 * Validator para crear un usuario (admin/superadmin).
 * El email se valida como único por tenant en el controlador.
 */
export const createUserValidator = vine.create({
  tenantId: vine.number().exists({ table: 'tenants', column: 'id' }),
  firstName: firstName(),
  lastName: lastName(),
  email: email(),
  password: password(),
  role: roleEnum(),
})

/**
 * Validator para mostrar un usuario.
 */
export const showUserValidator = vine.create({
  id: id(),
})

/**
 * Validator para dar de baja un usuario.
 */
export const destroyUserValidator = vine.create({
  id: id(),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: password(),
})

/**
 * Validator para actualizar un usuario. Todos los campos opcionales.
 */
export const updateUserValidator = vine.create({
  firstName: firstName().optional(),
  lastName: lastName().optional(),
  email: email().optional(),
  password: password().optional(),
  role: roleEnum().optional(),
  status: statusEnum().optional(),
})
