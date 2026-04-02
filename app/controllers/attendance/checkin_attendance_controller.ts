import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Branch from '#models/branch'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { checkInValidator } from '#validators/attendance'
import {
  assertMembershipActiveForCheckin,
  assertNoOpenAttendance,
  AttendanceEventType,
} from '#services/attendance_business_rules'

export default class CheckinAttendanceController {
  async checkin({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(checkInValidator)
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

    let membershipId: number | null = payload.clientMembershipId ?? null
    if (membershipId !== null) {
      const membership = await ClientMembership.notDeleted()
        .where('id', membershipId)
        .where('tenant_id', targetTenantId)
        .first()
      if (!membership || membership.clientId !== payload.clientId) {
        return response.status(422).send({
          errors: [
            { message: 'La membresía no existe en este gimnasio o no corresponde al cliente' },
          ],
        })
      }
      const membershipErr = assertMembershipActiveForCheckin(membership.status)
      if (membershipErr) {
        return response.status(422).send({ errors: [{ message: membershipErr }] })
      }
    } else {
      const activeMembership = await ClientMembership.notDeleted()
        .where('client_id', payload.clientId)
        .where('tenant_id', targetTenantId)
        .whereIn('status', [Status.ACTIVE, Status.FROZEN])
        .orderBy('id', 'desc')
        .first()
      membershipId = activeMembership?.id ?? null
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

    const openAttendance = await Attendance.notDeleted()
      .where('tenant_id', targetTenantId)
      .where('client_id', payload.clientId)
      .where('status', Status.CHECKED_IN)
      .whereNull('check_out_at')
      .first()

    const openErr = assertNoOpenAttendance(Boolean(openAttendance))
    if (openErr) {
      return response.status(422).send({ errors: [{ message: openErr }] })
    }

    const checkInAt = payload.checkInAt ?? DateTime.local()
    const attendance = await Attendance.create({
      tenantId: targetTenantId!,
      clientId: payload.clientId,
      clientMembershipId: membershipId,
      branchId: payload.branchId ?? null,
      attendanceDate: checkInAt.startOf('day'),
      checkInAt,
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: currentUser.id,
      notes: payload.notes ?? null,
    })

    await AttendanceEvent.create({
      tenantId: targetTenantId!,
      attendanceId: attendance.id,
      clientId: payload.clientId,
      eventType: AttendanceEventType.CHECKIN,
      eventAt: checkInAt,
      registeredBy: currentUser.id,
      notes: payload.notes ?? null,
      metadata: { source: 'checkin_endpoint' },
    })

    await attendance.load((loader) => {
      loader.load('client').load('branch').load('events')
    })

    return response.status(201).send({
      message: 'Check-in registrado correctamente',
      data: attendance,
    })
  }
}
