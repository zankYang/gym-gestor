import type { HttpContext } from '@adonisjs/core/http'
import ClientMembership from '#models/client_membership'
import { RoleCode } from '#enums/role_enum'

export default class DestroyMembershipController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const query = ClientMembership.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const membership = await query.first()

    if (!membership) {
      return response.status(404).send({
        errors: [{ message: 'Membresía no encontrada' }],
      })
    }

    await membership.softDelete()

    return response.status(200).send({
      message: 'Membresía dada de baja correctamente',
    })
  }
}
