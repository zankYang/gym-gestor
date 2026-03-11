import type { HttpContext } from '@adonisjs/core/http'
import Tenant from '#models/tenant'

export default class ListGymsController {
  /**
   * Lista todos los gyms. Solo superadmin.
   */
  async index({ response }: HttpContext) {
    const tenants = await Tenant.notDeleted().orderBy('name', 'asc')
    return response.status(200).send({
      message: 'Gyms listados correctamente',
      data: tenants,
    })
  }
}
