import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import { RoleCode } from '#enums/role_enum'

export default class DestroyClientController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const query = Client.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const client = await query.first()

    if (!client) {
      return response.status(404).send({
        errors: [{ message: 'Cliente no encontrado' }],
      })
    }

    await client.softDelete()

    return response.status(200).send({
      message: 'Cliente dado de baja correctamente',
    })
  }
}
