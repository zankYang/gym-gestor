import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import { RoleCode } from '#enums/role_enum'
import { listClientsQueryValidator, tenantIdQueryValidator } from '#validators/client'

export default class ListClientsController {
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

    const filters = await request.validateUsing(listClientsQueryValidator)

    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))

    const q = (filters.q ?? '').toString().trim()
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'desc') as 'asc' | 'desc'

    const query = Client.notDeleted()

    if (targetTenantId !== undefined) {
      query.where('tenant_id', targetTenantId)
    }

    if (q) {
      query.where((builder) => {
        builder
          .whereILike('first_name', `%${q}%`)
          .orWhereILike('last_name', `%${q}%`)
          .orWhereILike('email', `%${q}%`)
          .orWhereILike('phone', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const clients = await query.paginate(page, perPage)
    const { meta, data } = clients.toJSON()

    return response.status(200).send({
      message: 'Clientes listados correctamente',
      meta,
      data,
    })
  }
}
