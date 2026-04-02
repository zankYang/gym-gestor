import type { HttpContext } from '@adonisjs/core/http'
import MembershipPlan from '#models/membership_plan'
import { RoleCode } from '#enums/role_enum'
import { listPlansQueryValidator, tenantIdQueryValidator } from '#validators/plan'

export default class ListPlansController {
  async index({ auth, response, request }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    // tenantId solo se valida si el rol es SUPERADMIN.
    // En otros roles el filtro es ignorado (compatibilidad).
    let requestedTenantId: number | undefined
    if (currentRole === RoleCode.SUPERADMIN) {
      const { tenantId } = await request.validateUsing(tenantIdQueryValidator)
      requestedTenantId = tenantId !== undefined ? Number(tenantId) : undefined
    }

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN ? requestedTenantId : currentUser.tenantId

    const filters = await request.validateUsing(listPlansQueryValidator)

    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))

    const q = (filters.q ?? '').toString().trim()
    const statusFilter = filters.status as string | undefined
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'asc') as 'asc' | 'desc'

    const query = MembershipPlan.notDeleted()

    if (targetTenantId !== undefined) {
      query.where('tenant_id', targetTenantId)
    }

    if (statusFilter) {
      query.where('status', statusFilter)
    }

    if (q) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${q}%`)
          .orWhereILike('code', `%${q}%`)
          .orWhereILike('description', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const plans = await query.paginate(page, perPage)
    const { meta, data } = plans.toJSON()

    return response.status(200).send({
      message: 'Planes listados correctamente',
      meta,
      data,
    })
  }
}
