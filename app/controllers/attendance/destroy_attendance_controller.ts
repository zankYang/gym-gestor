import type { HttpContext } from '@adonisjs/core/http'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import { RoleCode } from '#enums/role_enum'
import { AttendanceEventType } from '#services/attendance_business_rules'

export default class DestroyAttendanceController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const query = Attendance.notDeleted().where('id', params.id)
    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const attendance = await query.first()
    if (!attendance) {
      return response.status(404).send({ errors: [{ message: 'Asistencia no encontrada' }] })
    }

    await AttendanceEvent.create({
      tenantId: attendance.tenantId,
      attendanceId: attendance.id,
      clientId: attendance.clientId,
      eventType: AttendanceEventType.MANUAL_ADJUSTMENT,
      eventAt: attendance.checkOutAt ?? attendance.checkInAt,
      registeredBy: currentUser.id,
      notes: 'Baja lógica de asistencia',
      metadata: { source: 'soft_delete' },
    })

    await attendance.softDelete()

    return response.status(200).send({
      message: 'Asistencia dada de baja correctamente',
    })
  }
}
