import vine from '@vinejs/vine'

export const createGymValidator = vine.create({
  name: vine.string(),
  slug: vine.string().unique({ table: 'gyms', column: 'slug' }),
  logoUrl: vine.string().nullable(),
  primaryColor: vine.string().nullable(),
  secondaryColor: vine.string().nullable(),
  accentColor: vine.string().nullable(),
  email: vine.string().nullable(),
  phone: vine.string().nullable(),
  address: vine.string().nullable(),
  status: vine.enum(['active', 'inactive', 'suspended']),
})

export const updateGymValidator = vine.create({
  name: vine.string().optional(),
  slug: vine.string().optional(),
  logoUrl: vine.string().nullable().optional(),
  primaryColor: vine.string().nullable().optional(),
  secondaryColor: vine.string().nullable().optional(),
  accentColor: vine.string().nullable().optional(),
  email: vine.string().nullable().optional(),
  phone: vine.string().nullable().optional(),
  address: vine.string().nullable().optional(),
  status: vine.enum(['active', 'inactive', 'suspended']).optional(),
})
