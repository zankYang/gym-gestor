import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
export default class ListUsersController {
  async index({ auth, response, request }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    const page = Math.max(1, Number(request.input('page', 1)))
    const perPage = Math.min(100, Math.max(1, Number(request.input('perPage', 10))))
    const q = (request.input('q') ?? '').toString().trim()
    const roleFilter = request.input('role') as string | undefined
    const status = request.input('status') as string | undefined
    const sortBy = (request.input('sortBy') ?? 'created_at').toString()
    let tenantIdFilter: number | undefined

    const sortDir = (request.input('sortDir') ?? 'desc') as 'asc' | 'desc'

    const query = User.notDeleted().where('tenant_id', currentUser.tenantId)

    if (currentUser.tenantId) {
      query.where('tenant_id', currentUser.tenantId)
    } else if (tenantIdFilter !== undefined && !Number.isNaN(Number(tenantIdFilter))) {
      query.where('tenant_id', Number(tenantIdFilter))
    }

    if (status) query.where('status', status)

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
