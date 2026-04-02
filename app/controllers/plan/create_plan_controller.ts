import type { HttpContext } from '@adonisjs/core/http'
import MembershipPlan from '#models/membership_plan'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { createPlanValidator } from '#validators/plan'

export default class CreatePlanController {
  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createPlanValidator)
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN ? payload.tenantId : currentUser.tenantId

    const existingPlan = await MembershipPlan.notDeleted()
      .where('tenant_id', targetTenantId!)
      .where('code', payload.code)
      .first()

    if (existingPlan) {
      return response.status(409).send({
        errors: [{ message: 'Ya existe un plan con ese código en este gym' }],
      })
    }

    const plan = await MembershipPlan.create({
      tenantId: targetTenantId!,
      name: payload.name,
      code: payload.code,
      description: payload.description ?? null,
      durationDays: payload.durationDays,
      price: payload.price,
      allowsClasses: payload.allowsClasses ?? false,
      allowsFreeze: payload.allowsFreeze ?? false,
      freezeDaysLimit: payload.freezeDaysLimit ?? 0,
      status: payload.status ?? Status.ACTIVE,
    })

    return response.status(201).send({
      message: 'Plan creado correctamente',
      data: plan,
    })
  }
}
