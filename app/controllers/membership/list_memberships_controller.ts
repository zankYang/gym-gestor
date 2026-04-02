import type { HttpContext } from '@adonisjs/core/http'
import ClientMembership from '#models/client_membership'
import { RoleCode } from '#enums/role_enum'
import { listMembershipsQueryValidator, tenantIdQueryValidator } from '#validators/membership'

export default class ListMembershipsController {
  async index({ auth, response, request }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    let requestedTenantId: number | undefined
    if (currentRole === RoleCode.SUPERADMIN) {
      const { tenantId } = await request.validateUsing(tenantIdQueryValidator)
      requestedTenantId = tenantId !== undefined ? Number(tenantId) : undefined
    }

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN ? requestedTenantId : currentUser.tenantId

    const filters = await request.validateUsing(listMembershipsQueryValidator)

    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))

    const q = (filters.q ?? '').toString().trim()
    const statusFilter = filters.status as string | undefined
    const clientIdFilter = filters.clientId
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'asc') as 'asc' | 'desc'

    const query = ClientMembership.notDeleted()
      .preload('client')
      .preload('membershipPlan')
      .preload('branch')

    if (targetTenantId !== undefined) {
      query.where('tenant_id', targetTenantId)
    }

    if (statusFilter) {
      query.where('status', statusFilter)
    }

    if (clientIdFilter !== undefined) {
      query.where('client_id', clientIdFilter)
    }

    if (q) {
      query.where((builder) => {
        builder.whereILike('notes', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const memberships = await query.paginate(page, perPage)
    const { meta, data } = memberships.toJSON()

    return response.status(200).send({
      message: 'Membresías listadas correctamente',
      meta,
      data,
    })
  }
}
