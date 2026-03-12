import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { AttendanceFactory } from '#database/factories/attendance_factory'
import Tenant from '#models/tenant'
import ClientMembership from '#models/client_membership'
import User from '#models/user'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export default class AttendanceSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.query().where('status', Status.ACTIVE)

    for (const tenant of tenants) {
      const memberships = await ClientMembership.query()
        .where('tenant_id', tenant.id)
        .where('status', Status.ACTIVE)

      const adminUser = await User.query()
        .where('tenant_id', tenant.id)
        .orderBy('id', 'asc')
        .first()

      for (const membership of memberships) {
        const attendanceDays = Math.floor(Math.random() * 8) + 3

        for (let i = 0; i < attendanceDays; i++) {
          const daysAgo = Math.floor(Math.random() * 30)
          const attendanceDate = DateTime.now().minus({ days: daysAgo })
          const checkInAt = attendanceDate.set({
            hour: Math.floor(Math.random() * 15) + 6,
            minute: Math.floor(Math.random() * 60),
            second: 0,
            millisecond: 0,
          })

          await AttendanceFactory.merge({
            tenantId: tenant.id,
            clientId: membership.clientId,
            clientMembershipId: membership.id,
            branchId: membership.branchId,
            attendanceDate,
            checkInAt,
            status: Status.CHECKED_IN,
            registeredBy: adminUser?.id ?? 1,
          }).create()
        }
      }
    }
  }
}
