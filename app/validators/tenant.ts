import vine from '@vinejs/vine'

export const createTenantValidator = vine.create({
  name: vine.string(),
  slug: vine.string().unique({ table: 'tenants', column: 'slug' }),
  logoUrl: vine.string().nullable().optional(),
  banner: vine.string().nullable().optional(),
  backgroundImageUrl: vine.string().nullable().optional(),
  primaryColor: vine.string().nullable().optional(),
  secondaryColor: vine.string().nullable().optional(),
  email: vine.string().nullable().optional(),
  phone: vine.string().nullable().optional(),
  address: vine.string().nullable().optional(),
  status: vine.enum(['active', 'inactive', 'suspended']),
})

export const updateTenantValidator = vine.create({
  name: vine.string().optional(),
  slug: vine.string().optional(),
  logoUrl: vine.string().nullable().optional(),
  banner: vine.string().nullable().optional(),
  backgroundImageUrl: vine.string().nullable().optional(),
  primaryColor: vine.string().nullable().optional(),
  secondaryColor: vine.string().nullable().optional(),
  email: vine.string().nullable().optional(),
  phone: vine.string().nullable().optional(),
  address: vine.string().nullable().optional(),
  status: vine.enum(['active', 'inactive', 'suspended']).optional(),
})
