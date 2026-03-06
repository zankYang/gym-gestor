import type { HttpContext } from '@adonisjs/core/http'
import Gym from '#models/gym'

export default class ListGymsController {
  /**
   * Lista todos los gyms. Solo superadmin.
   */
  async index({ response }: HttpContext) {
    const gyms = await Gym.notDeleted().orderBy('name', 'asc')
    return response.status(200).send({
      message: 'Gyms listados correctamente',
      data: gyms,
    })
  }
}
