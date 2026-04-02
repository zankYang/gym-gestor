import type { HttpContext } from '@adonisjs/core/http'
import Attendance from '#models/attendance'
import { RoleCode } from '#enums/role_enum'

export default class ShowAttendanceController {
  async show({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const query = Attendance.notDeleted()
      .where('id', params.id)
      .preload('client')
      .preload('branch')
      .preload('registeredByUser')
      .preload('events')

    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const attendance = await query.first()
    if (!attendance) {
      return response.status(404).send({
        errors: [{ message: 'Asistencia no encontrada' }],
      })
    }

    return response.status(200).send({
      message: 'Asistencia encontrada',
      data: attendance,
    })
  }
}
