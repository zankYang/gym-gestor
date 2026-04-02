import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import { updateClientValidator } from '#validators/client'
import { RoleCode } from '#enums/role_enum'

export default class UpdateClientController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const payload = await request.validateUsing(updateClientValidator)

    let query = Client.notDeleted().where('id', params.id)
    if (currentRole !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', currentUser.tenantId)
      delete (payload as any).tenantId
    }

    const client = await query.first()

    if (!client) {
      return response.status(404).send({
        errors: [{ message: 'Cliente no encontrado' }],
      })
    }

    client.merge(payload)
    client.updatedBy = currentUser.id
    await client.save()

    return response.status(200).send({
      message: 'Cliente actualizado correctamente',
      data: client,
    })
  }
}
