import type { HttpContext } from '@adonisjs/core/http'
import MembershipPlan from '#models/membership_plan'
import { RoleCode } from '#enums/role_enum'

export default class DestroyPlanController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const query = MembershipPlan.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const plan = await query.first()

    if (!plan) {
      return response.status(404).send({
        errors: [{ message: 'Plan no encontrado' }],
      })
    }

    await plan.softDelete()

    return response.status(200).send({
      message: 'Plan dado de baja correctamente',
    })
  }
}
