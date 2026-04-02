import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'

export default class CatalogRolesController {
  async index({ response }: HttpContext) {
    const roles = await Role.query().apply((scopes) => scopes.withoutSuperadmin())
    return response.status(200).send({
      message: 'Roles obtenidos correctamente',
      data: roles,
    })
  }
}
