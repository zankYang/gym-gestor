import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { PaymentFactory } from '#database/factories/payment_factory'
import Tenant from '#models/tenant'
import ClientMembership from '#models/client_membership'
import PaymentMethod from '#models/payment_method'
import User from '#models/user'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export default class PaymentSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.query().where('status', Status.ACTIVE)
    const paymentMethods = await PaymentMethod.all()

    if (!paymentMethods.length) return

    for (const tenant of tenants) {
      const memberships = await ClientMembership.query()
        .where('tenant_id', tenant.id)
        .preload('client')

      const adminUser = await User.query()
        .where('tenant_id', tenant.id)
        .orderBy('id', 'asc')
        .first()

      for (const membership of memberships) {
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

        await PaymentFactory.merge({
          tenantId: tenant.id,
          clientId: membership.clientId,
          clientMembershipId: membership.id,
          paymentMethodId: paymentMethod.id,
          branchId: membership.branchId,
          amount: membership.finalAmount,
          paymentDate: membership.startDate ?? DateTime.now(),
          concept: 'Pago membresía',
          status: Status.PAID,
          registeredBy: adminUser?.id ?? 1,
        }).create()
      }
    }
  }
}
