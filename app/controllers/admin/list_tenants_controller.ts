import type { HttpContext } from '@adonisjs/core/http'
import Tenant from '#models/tenant'

export default class ListTenantsController {
  async index({ response, request }: HttpContext) {
    const {
      page: rawPage = 1,
      perPage: rawPerPage = 10,
      q: rawQ = '',
      status: statusFilter,
      sortBy: rawSortBy = 'name',
      sortDir: rawSortDir = 'asc',
      createdFrom,
      createdTo,
    } = request.qs()

    const page = Math.max(1, Number(rawPage) || 1)
    const perPage = Math.min(100, Math.max(1, Number(rawPerPage) || 10))
    const q = rawQ.toString().trim()
    const sortBy = rawSortBy.toString()
    const sortDir = (rawSortDir === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'

    const query = Tenant.notDeleted()

    if (statusFilter) {
      query.where('status', statusFilter)
    }

    if (q) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${q}%`)
          .orWhereILike('slug', `%${q}%`)
          .orWhereILike('email', `%${q}%`)
          .orWhereILike('phone', `%${q}%`)
      })
    }

    if (createdFrom) {
      query.where('created_at', '>=', createdFrom)
    }

    if (createdTo) {
      query.where('created_at', '<=', createdTo)
    }

    query.orderBy(sortBy, sortDir)

    const tenants = await query.paginate(page, perPage)
    const { meta, data } = tenants.toJSON()

    return response.status(200).send({
      message: 'Tenants listados correctamente',
      meta,
      data,
    })
  }
}
