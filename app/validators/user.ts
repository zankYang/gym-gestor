import vine from '@vinejs/vine'
import { Role } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

const fullName = () => vine.string().trim().minLength(3).maxLength(100)
const email = () => vine.string().email().maxLength(150)
const password = () => vine.string().minLength(8).maxLength(20)
const roleEnum = () => vine.string().in([Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER])
const statusEnum = () => vine.string().in([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED])
const id = () => vine.number().exists({ table: 'users', column: 'id' })
/**
 * Validator para crear un usuario (admin/superadmin).
 * El email se valida como único por gym en el controlador.
 */
export const createUserValidator = vine.create({
  gymId: vine.number().exists({ table: 'gyms', column: 'id' }),
  fullName: fullName(),
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
  fullName: fullName().optional(),
  email: email().optional(),
  password: password().optional(),
  role: roleEnum().optional(),
  status: statusEnum().optional(),
})
