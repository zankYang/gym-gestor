import type { HttpContext } from '@adonisjs/core/http'
import { updateGymValidator } from '#validators/gym'
import Tenant from '#models/tenant'

export default class UpdateGymController {
  /**
   * Actualiza un gym por id. Solo superadmin puede gestionar cualquier gym.
   */
  async update({ params, request, response }: HttpContext) {
    const tenant = await Tenant.notDeleted().where('id', params.id).firstOrFail()
    const payload = await request.validateUsing(updateGymValidator)

    if (payload.slug !== undefined && payload.slug !== tenant.slug) {
      const existing = await Tenant.notDeleted()
        .where('slug', payload.slug)
        .whereNot('id', tenant.id)
        .first()
      if (existing) {
        return response.badRequest({
          message: 'Ya existe otro gym con ese slug',
        })
      }
    }

    tenant.merge(payload)
    await tenant.save()

    return response.ok({
      message: 'Gym actualizado correctamente',
      data: tenant,
    })
  }
}
