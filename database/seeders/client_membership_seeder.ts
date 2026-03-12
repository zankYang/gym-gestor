import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ClientMembershipFactory } from '#database/factories/client_membership_factory'
import Tenant from '#models/tenant'
import Client from '#models/client'
import MembershipPlan from '#models/membership_plan'
import User from '#models/user'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export default class ClientMembershipSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.query().where('status', Status.ACTIVE)

    for (const tenant of tenants) {
      const clients = await Client.query().where('tenant_id', tenant.id)
      const plans = await MembershipPlan.query()
        .where('tenant_id', tenant.id)
        .whereNot('code', 'VISITA')
      const adminUser = await User.query()
        .where('tenant_id', tenant.id)
        .orderBy('id', 'asc')
        .first()

      if (!plans.length || !clients.length) continue

      for (const client of clients) {
        const plan = plans[Math.floor(Math.random() * plans.length)]
        const startDate = DateTime.now().minus({ days: Math.floor(Math.random() * 30) })
        const endDate = startDate.plus({ days: plan.durationDays })

        await ClientMembershipFactory.merge({
          tenantId: tenant.id,
          clientId: client.id,
          membershipPlanId: plan.id,
          branchId: client.branchId,
          startDate,
          endDate,
          status: Status.ACTIVE,
          priceAtPurchase: plan.price,
          discountAmount: '0.00',
          finalAmount: plan.price,
          createdBy: adminUser?.id ?? 1,
        }).create()
      }
    }
  }
}
