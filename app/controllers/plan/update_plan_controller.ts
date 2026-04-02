import type { HttpContext } from '@adonisjs/core/http'
import MembershipPlan from '#models/membership_plan'
import { RoleCode } from '#enums/role_enum'
import { updatePlanValidator } from '#validators/plan'

export default class UpdatePlanController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const payload = await request.validateUsing(updatePlanValidator)

    let query = MembershipPlan.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', currentUser.tenantId)
      delete (payload as any).tenantId
    }

    const plan = await query.first()

    if (!plan) {
      return response.status(404).send({
        errors: [{ message: 'Plan no encontrado' }],
      })
    }

    const nextTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? plan.tenantId)
        : currentUser.tenantId

    const nextCode = (payload.code ?? plan.code) as string

    const tenantIdProvided = payload.tenantId !== undefined
    const codeProvided = payload.code !== undefined

    if (tenantIdProvided || codeProvided) {
      const duplicate = await MembershipPlan.notDeleted()
        .where('tenant_id', nextTenantId)
        .where('code', nextCode)
        .whereNot('id', plan.id)
        .first()

      if (duplicate) {
        return response.status(409).send({
          errors: [{ message: 'Ya existe un plan con ese código en este gym' }],
        })
      }
    }

    plan.merge(payload)
    await plan.save()

    return response.status(200).send({
      message: 'Plan actualizado correctamente',
      data: plan,
    })
  }
}
