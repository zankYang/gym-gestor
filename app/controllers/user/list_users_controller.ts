import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RoleCode } from '#enums/role_enum'
import { listUsersQueryValidator, tenantIdQueryValidator } from '#validators/user'

export default class ListUsersController {
  async index({ auth, response, request }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    await currentUser.load((preloader) => preloader.load('role'))
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

    const filters = await request.validateUsing(listUsersQueryValidator)

    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))
    const q = (filters.q ?? '').toString().trim()
    const roleFilter = filters.role as string | undefined
    const statusFilter = filters.status as string | undefined
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'desc') as 'asc' | 'desc'

    const query = User.notDeleted()

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
