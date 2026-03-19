import vine from '@vinejs/vine'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

const firstName = () => vine.string().trim().minLength(1).maxLength(100)
const lastName = () => vine.string().trim().minLength(1).maxLength(100)
const email = () => vine.string().email().maxLength(150)
const password = () => vine.string().minLength(8).maxLength(20)
const roleEnum = () => vine.string().in([RoleCode.ADMIN, RoleCode.RECEPTIONIST, RoleCode.COACH])
const statusEnum = () => vine.string().in([Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED])
const avatarUrl = () => vine.string().url().maxLength(255)
const tenantId = () => vine.number().exists({ table: 'tenants', column: 'id' })
/**
 * Validator para crear un usuario (admin/superadmin).
 * El email se valida como único por tenant en el controlador.
 */
export const createUserValidator = vine.create({
  tenantId: tenantId().optional(),
  avatarUrl: avatarUrl().optional(),
  firstName: firstName(),
  lastName: lastName(),
  email: email(),
  password: password(),
  role: roleEnum(),
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
  avatarUrl: avatarUrl().optional(),
  email: email().optional(),
  password: password().optional(),
  role: roleEnum().optional(),
  status: statusEnum().optional(),
})

/**
 * Query validator for GET /api/users
 *
 * Nota: `tenantId` se valida de forma condicional en el controlador (solo para
 * SUPERADMIN), para mantener compatibilidad cuando el filtro se ignora.
 */
const roleFilterEnum = () =>
  vine.string().in([RoleCode.SUPERADMIN, RoleCode.ADMIN, RoleCode.RECEPTIONIST, RoleCode.COACH])

export const listUsersQueryValidator = vine.create({
  page: vine.number().optional(),
  perPage: vine.number().optional(),
  q: vine.string().trim().maxLength(100).optional(),
  role: roleFilterEnum().optional(),
  status: statusEnum().optional(),
  sortBy: vine.string().trim().maxLength(50).optional(),
  sortDir: vine.string().in(['asc', 'desc']).optional(),
})

export const tenantIdQueryValidator = vine.create({
  tenantId: vine.number().optional(),
})
