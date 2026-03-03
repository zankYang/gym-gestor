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
