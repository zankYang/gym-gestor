import type { HttpContext } from '@adonisjs/core/http'
import { updateGymValidator } from '#validators/gym'
import Gym from '#models/gym'

export default class UpdateGymController {
  /**
   * Actualiza un gym por id. Solo superadmin puede gestionar cualquier gym.
   */
  async update({ params, request, response }: HttpContext) {
    const gym = await Gym.notDeleted().where('id', params.id).firstOrFail()
    const payload = await request.validateUsing(updateGymValidator)

    if (payload.slug !== undefined && payload.slug !== gym.slug) {
      const existing = await Gym.notDeleted()
        .where('slug', payload.slug)
        .whereNot('id', gym.id)
        .first()
      if (existing) {
        return response.badRequest({
          message: 'Ya existe otro gym con ese slug',
        })
      }
    }

    gym.merge(payload)
    await gym.save()

    return response.ok({
      message: 'Gym actualizado correctamente',
      data: gym,
    })
  }
}
