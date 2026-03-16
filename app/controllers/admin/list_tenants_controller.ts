import type { HttpContext } from '@adonisjs/core/http'
import Tenant from '#models/tenant'

export default class ListTenantsController {
  async index({ response }: HttpContext) {
    const tenants = await Tenant.notDeleted().orderBy('name', 'asc')
    return response.status(200).send({
      message: 'Tenants listados correctamente',
      data: tenants,
    })
  }
}
