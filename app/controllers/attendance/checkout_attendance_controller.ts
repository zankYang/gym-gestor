import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { checkOutValidator } from '#validators/attendance'
import {
  assertCheckOutAfterCheckIn,
  assertOpenAttendanceStatus,
  AttendanceEventType,
} from '#services/attendance_business_rules'

export default class CheckoutAttendanceController {
  async checkout({ auth, params, request, response }: HttpContext) {
    const payload = await request.validateUsing(checkOutValidator)
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

    const statusErr = assertOpenAttendanceStatus(attendance.status)
    if (statusErr) {
      return response.status(422).send({ errors: [{ message: statusErr }] })
    }

    const checkOutAt = payload.checkOutAt ?? DateTime.local()
    const dateErr = assertCheckOutAfterCheckIn(attendance.checkInAt, checkOutAt)
    if (dateErr) {
      return response.status(422).send({ errors: [{ message: dateErr }] })
    }

    attendance.checkOutAt = checkOutAt
    attendance.status = Status.CHECKED_OUT
    if (payload.notes) {
      attendance.notes = attendance.notes ? `${attendance.notes}\n${payload.notes}` : payload.notes
    }
    await attendance.save()

    await AttendanceEvent.create({
      tenantId: attendance.tenantId,
      attendanceId: attendance.id,
      clientId: attendance.clientId,
      eventType: AttendanceEventType.CHECKOUT,
      eventAt: checkOutAt,
      registeredBy: currentUser.id,
      notes: payload.notes ?? null,
      metadata: { source: 'checkout_endpoint' },
    })

    await attendance.load((loader) => {
      loader.load('client').load('branch').load('events')
    })

    return response.status(200).send({
      message: 'Checkout registrado correctamente',
      data: attendance,
    })
  }
}
