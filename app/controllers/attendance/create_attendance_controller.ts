import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Branch from '#models/branch'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { createAttendanceValidator } from '#validators/attendance'
import {
  assertCheckOutAfterCheckIn,
  AttendanceEventType,
  type AttendanceEventTypeValue,
} from '#services/attendance_business_rules'

export default class CreateAttendanceController {
  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createAttendanceValidator)
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? currentUser.tenantId)
        : currentUser.tenantId

    const client = await Client.notDeleted()
      .where('id', payload.clientId)
      .where('tenant_id', targetTenantId)
      .first()
    if (!client) {
      return response
        .status(422)
        .send({ errors: [{ message: 'El cliente no existe en este gimnasio' }] })
    }

    if (payload.clientMembershipId !== undefined && payload.clientMembershipId !== null) {
      const membership = await ClientMembership.notDeleted()
        .where('id', payload.clientMembershipId)
        .where('tenant_id', targetTenantId)
        .first()
      if (!membership || membership.clientId !== payload.clientId) {
        return response.status(422).send({
          errors: [
            { message: 'La membresía no existe en este gimnasio o no corresponde al cliente' },
          ],
        })
      }
    }

    if (payload.branchId !== undefined && payload.branchId !== null) {
      const branch = await Branch.notDeleted()
        .where('id', payload.branchId)
        .where('tenant_id', targetTenantId)
        .first()
      if (!branch) {
        return response
          .status(422)
          .send({ errors: [{ message: 'La sucursal no existe en este gimnasio' }] })
      }
    }

    const checkInAt = payload.checkInAt ?? DateTime.local()
    const checkOutAt = payload.checkOutAt ?? null
    if (checkOutAt) {
      const dateErr = assertCheckOutAfterCheckIn(checkInAt, checkOutAt)
      if (dateErr) {
        return response.status(422).send({ errors: [{ message: dateErr }] })
      }
    }

    const status = payload.status ?? (checkOutAt ? Status.CHECKED_OUT : Status.CHECKED_IN)
    const attendanceDate = payload.attendanceDate ?? checkInAt.startOf('day')

    const attendance = await Attendance.create({
      tenantId: targetTenantId!,
      clientId: payload.clientId,
      clientMembershipId: payload.clientMembershipId ?? null,
      branchId: payload.branchId ?? null,
      attendanceDate,
      checkInAt,
      checkOutAt,
      status,
      registeredBy: currentUser.id,
      notes: payload.notes ?? null,
    })

    let eventType: AttendanceEventTypeValue = AttendanceEventType.MANUAL_ADJUSTMENT
    if (status === Status.DENIED) eventType = AttendanceEventType.DENIED
    if (status === Status.CHECKED_IN) eventType = AttendanceEventType.CHECKIN
    if (status === Status.CHECKED_OUT) eventType = AttendanceEventType.CHECKOUT

    await AttendanceEvent.create({
      tenantId: targetTenantId!,
      attendanceId: attendance.id,
      clientId: payload.clientId,
      eventType,
      eventAt: checkOutAt ?? checkInAt,
      registeredBy: currentUser.id,
      notes: payload.notes ?? null,
      metadata: { source: 'manual_create' },
    })

    await attendance.load((loader) => {
      loader.load('client').load('branch').load('events')
    })

    return response.status(201).send({
      message: 'Asistencia creada correctamente',
      data: attendance,
    })
  }
}
