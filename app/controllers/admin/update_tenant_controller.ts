import type { HttpContext } from '@adonisjs/core/http'
import { updateTenantValidator } from '#validators/tenant'
import Tenant from '#models/tenant'

export default class UpdateTenantController {
  async update({ params, request, response }: HttpContext) {
    const tenant = await Tenant.notDeleted().where('id', params.id).firstOrFail()
    const payload = await request.validateUsing(updateTenantValidator)

    if (payload.slug !== undefined && payload.slug !== tenant.slug) {
      const existing = await Tenant.notDeleted()
        .where('slug', payload.slug)
        .whereNot('id', tenant.id)
        .first()
      if (existing) {
        return response.badRequest({
          errors: [{ message: 'Ya existe otro tenant con ese slug' }],
        })
      }
    }

    tenant.merge(payload)
    await tenant.save()

    return response.ok({
      message: 'Tenant actualizado correctamente',
      data: tenant,
    })
  }
}
