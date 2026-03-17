import type { HttpContext } from '@adonisjs/core/http'
import Tenant from '#models/tenant'

export default class DestroyTenantController {
  /**
   * Borrado lógico de un tenant por id. Solo superadmin.
   * El registro permanece en BD con deleted_at; deja de aparecer en listados.
   */
  async destroy({ params, response }: HttpContext) {
    const tenant = await Tenant.notDeleted().where('id', params.id).first()
    if (!tenant) {
      return response.status(404).send({
        errors: [{ message: 'Tenant no encontrado' }],
      })
    }
    await tenant.softDelete()
    return response.status(200).send({
      message: 'Tenant dado de baja correctamente',
    })
  }
}
