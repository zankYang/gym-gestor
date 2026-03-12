import type { HttpContext } from '@adonisjs/core/http'
import Tenant from '#models/tenant'

export default class DestroyGymController {
  /**
   * Borrado lógico de un gym por id. Solo superadmin.
   * El registro permanece en BD con deleted_at; deja de aparecer en listados.
   */
  async destroy({ params, response }: HttpContext) {
    const tenant = await Tenant.notDeleted().where('id', params.id).firstOrFail()
    await tenant.softDelete()
    return response.status(200).send({
      message: 'Gym dado de baja correctamente',
    })
  }
}
