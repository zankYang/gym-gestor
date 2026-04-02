import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import { RoleCode } from '#enums/role_enum'
import { listPaymentsQueryValidator, tenantIdQueryValidator } from '#validators/payment'

export default class ListPaymentsController {
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

    const filters = await request.validateUsing(listPaymentsQueryValidator)
    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))

    const q = (filters.q ?? '').toString().trim()
    const statusFilter = filters.status as string | undefined
    const clientIdFilter = filters.clientId
    const paymentMethodIdFilter = filters.paymentMethodId
    const dateFrom = filters.dateFrom
    const dateTo = filters.dateTo
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'desc') as 'asc' | 'desc'

    const query = Payment.notDeleted()
      .preload('client')
      .preload('paymentMethod')
      .preload('branch')
      .preload('registeredByUser')

    if (targetTenantId !== undefined) {
      query.where('tenant_id', targetTenantId)
    }

    if (statusFilter) {
      query.where('status', statusFilter)
    }

    if (clientIdFilter !== undefined) {
      query.where('client_id', clientIdFilter)
    }

    if (paymentMethodIdFilter !== undefined) {
      query.where('payment_method_id', paymentMethodIdFilter)
    }

    if (dateFrom) {
      query.where('payment_date', '>=', dateFrom.toSQL()!)
    }

    if (dateTo) {
      query.where('payment_date', '<=', dateTo.endOf('day').toSQL()!)
    }

    if (q) {
      query.where((builder) => {
        builder.whereILike('concept', `%${q}%`).orWhereILike('reference', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const payments = await query.paginate(page, perPage)
    const { meta, data } = payments.toJSON()

    return response.status(200).send({
      message: 'Cobros listados correctamente',
      meta,
      data,
    })
  }
}
