import type { HttpContext } from '@adonisjs/core/http'
import Attendance from '#models/attendance'
import { RoleCode } from '#enums/role_enum'
import { listAttendancesQueryValidator, tenantIdQueryValidator } from '#validators/attendance'

export default class ListAttendancesController {
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

    const filters = await request.validateUsing(listAttendancesQueryValidator)

    const page = Math.max(1, Number(filters.page ?? 1))
    const perPage = Math.min(100, Math.max(1, Number(filters.perPage ?? 10)))
    const q = (filters.q ?? '').toString().trim()
    const statusFilter = filters.status as string | undefined
    const clientIdFilter = filters.clientId
    const branchIdFilter = filters.branchId
    const dateFrom = filters.dateFrom
    const dateTo = filters.dateTo
    const sortBy = (filters.sortBy ?? 'created_at').toString()
    const sortDir = (filters.sortDir ?? 'desc') as 'asc' | 'desc'

    const query = Attendance.notDeleted()
      .preload('client')
      .preload('branch')
      .preload('registeredByUser')
      .preload('events')

    if (targetTenantId !== undefined) {
      query.where('tenant_id', targetTenantId)
    }

    if (statusFilter) {
      query.where('status', statusFilter)
    }

    if (clientIdFilter !== undefined) {
      query.where('client_id', clientIdFilter)
    }

    if (branchIdFilter !== undefined) {
      query.where('branch_id', branchIdFilter)
    }

    if (dateFrom) {
      query.where('attendance_date', '>=', dateFrom.toSQLDate()!)
    }
    if (dateTo) {
      query.where('attendance_date', '<=', dateTo.toSQLDate()!)
    }

    if (q) {
      query.where((builder) => {
        builder.whereILike('notes', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const attendances = await query.paginate(page, perPage)
    const { meta, data } = attendances.toJSON()

    return response.status(200).send({
      message: 'Asistencias listadas correctamente',
      meta,
      data,
    })
  }
}
