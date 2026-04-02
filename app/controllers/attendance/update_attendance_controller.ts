import type { HttpContext } from '@adonisjs/core/http'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Branch from '#models/branch'
import { RoleCode } from '#enums/role_enum'
import { updateAttendanceValidator } from '#validators/attendance'
import {
  assertCheckOutAfterCheckIn,
  AttendanceEventType,
} from '#services/attendance_business_rules'

export default class UpdateAttendanceController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code
    const payload = await request.validateUsing(updateAttendanceValidator)

    let query = Attendance.notDeleted().where('id', params.id)
    if (currentRole !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', currentUser.tenantId)
      delete (payload as { tenantId?: number }).tenantId
    }

    const attendance = await query.first()
    if (!attendance) {
      return response.status(404).send({ errors: [{ message: 'Asistencia no encontrada' }] })
    }

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? attendance.tenantId)
        : currentUser.tenantId

    const nextClientId = payload.clientId ?? attendance.clientId
    const nextMembershipId =
      payload.clientMembershipId !== undefined
        ? payload.clientMembershipId
        : attendance.clientMembershipId
    const nextBranchId = payload.branchId !== undefined ? payload.branchId : attendance.branchId
    const nextCheckInAt = payload.checkInAt ?? attendance.checkInAt
    const nextCheckOutAt =
      payload.checkOutAt !== undefined ? payload.checkOutAt : attendance.checkOutAt

    const client = await Client.notDeleted()
      .where('id', nextClientId)
      .where('tenant_id', targetTenantId)
      .first()
    if (!client) {
      return response
        .status(422)
        .send({ errors: [{ message: 'El cliente no existe en este gimnasio' }] })
    }

    if (nextMembershipId !== undefined && nextMembershipId !== null) {
      const membership = await ClientMembership.notDeleted()
        .where('id', nextMembershipId)
        .where('tenant_id', targetTenantId)
        .first()
      if (!membership || membership.clientId !== nextClientId) {
        return response.status(422).send({
          errors: [
            { message: 'La membresía no existe en este gimnasio o no corresponde al cliente' },
          ],
        })
      }
    }

    if (nextBranchId !== undefined && nextBranchId !== null) {
      const branch = await Branch.notDeleted()
        .where('id', nextBranchId)
        .where('tenant_id', targetTenantId)
        .first()
      if (!branch) {
        return response
          .status(422)
          .send({ errors: [{ message: 'La sucursal no existe en este gimnasio' }] })
      }
    }

    if (nextCheckOutAt) {
      const dateErr = assertCheckOutAfterCheckIn(nextCheckInAt, nextCheckOutAt)
      if (dateErr) {
        return response.status(422).send({ errors: [{ message: dateErr }] })
      }
    }

    attendance.merge(payload)
    await attendance.save()

    await AttendanceEvent.create({
      tenantId: targetTenantId!,
      attendanceId: attendance.id,
      clientId: nextClientId,
      eventType: AttendanceEventType.MANUAL_ADJUSTMENT,
      eventAt: nextCheckOutAt ?? nextCheckInAt,
      registeredBy: currentUser.id,
      notes: payload.notes ?? 'Ajuste manual de asistencia',
      metadata: { source: 'manual_update' },
    })

    await attendance.load((loader) => {
      loader.load('client').load('branch').load('events')
    })

    return response.status(200).send({
      message: 'Asistencia actualizada correctamente',
      data: attendance,
    })
  }
}
