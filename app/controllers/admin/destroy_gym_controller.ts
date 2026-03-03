import type { HttpContext } from '@adonisjs/core/http'
import Gym from '#models/gym'

export default class DestroyGymController {
  /**
   * Borrado lógico de un gym por id. Solo superadmin.
   * El registro permanece en BD con deleted_at; deja de aparecer en listados.
   */
  async destroy({ params, response }: HttpContext) {
    const gym = await Gym.notDeleted().where('id', params.id).firstOrFail()
    await gym.softDelete()
    return response.status(200).send({
      message: 'Gym dado de baja correctamente',
    })
  }
}
