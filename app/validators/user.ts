import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

const roleEnum = () => vine.string().in(['superadmin', 'admin', 'receptionist', 'trainer'])
const statusEnum = () => vine.string().in(['active', 'inactive'])

/**
 * Validator para crear un usuario (admin/superadmin).
 * El email se valida como único por gym en el controlador.
 */
export const createUserValidator = vine.create({
  gymId: vine.number().nullable().optional(),
  fullName: vine.string().trim().minLength(1).maxLength(150),
  email: vine.string().email().maxLength(150),
  password: vine.string().minLength(8).maxLength(32),
  passwordConfirmation: vine.string().minLength(8).maxLength(32).sameAs('password'),
  role: roleEnum(),
  status: statusEnum().optional(),
})

/**
 * Validator para actualizar un usuario. Todos los campos opcionales.
 */
export const updateUserValidator = vine.create({
  gymId: vine.number().nullable().optional(),
  fullName: vine.string().trim().minLength(1).maxLength(150).optional(),
  email: vine.string().email().maxLength(150).optional(),
  password: vine.string().minLength(8).maxLength(32).optional(),
  passwordConfirmation: vine.string().minLength(8).maxLength(32).sameAs('password').optional(),
  role: roleEnum().optional(),
  status: statusEnum().optional(),
})
