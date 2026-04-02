import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RoleCode } from '#enums/role_enum'
import { listUsersQueryValidator, tenantIdQueryValidator } from '#validators/user'

export default class ListUsersController {
  async index({ consumer, response, request }: HttpContext) {
    const { tenantId } = await request.validateUsing(tenantIdQueryValidator)
    const filters = await request.validateUsing(listUsersQueryValidator)

    const targetTenantId = consumer.role.code === RoleCode.SUPERADMIN ? tenantId : consumer.tenantId

    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))
    const q = (filters.q ?? '').toString().trim()
    const roleFilter = filters.role as string | undefined
    const statusFilter = filters.status as string | undefined
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'asc') as 'asc' | 'desc'

    const query = User.notDeleted().preload('role', (builder) => {
      builder.select(['id', 'name', 'code'])
    })

    query.whereHas('role', (builder) => {
      builder.whereNot('code', RoleCode.SUPERADMIN)
    })

    if (targetTenantId !== undefined) {
      query.where('tenant_id', targetTenantId)
    }

    if (statusFilter) {
      query.where('status', statusFilter)
    }

    if (roleFilter) {
      query.whereHas('role', (builder) => {
        builder.where('code', roleFilter)
      })
    }

    if (q) {
      query.where((builder) => {
        builder
          .whereILike('first_name', `%${q}%`)
          .orWhereILike('last_name', `%${q}%`)
          .orWhereILike('email', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const users = await query.paginate(page, perPage)
    const { meta, data } = users.toJSON()

    return response.status(200).send({
      message: 'Usuarios listados correctamente',
      meta,
      data,
    })
  }
}
