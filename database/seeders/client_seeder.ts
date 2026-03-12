import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ClientFactory } from '#database/factories/client_factory'
import Tenant from '#models/tenant'
import Branch from '#models/branch'
import User from '#models/user'
import { Status } from '#enums/status_enum'

export default class ClientSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.query().where('status', Status.ACTIVE)

    for (const tenant of tenants) {
      const branches = await Branch.query().where('tenant_id', tenant.id)
      const adminUser = await User.query()
        .where('tenant_id', tenant.id)
        .orderBy('id', 'asc')
        .first()

      const clientCount = 10

      for (let i = 0; i < clientCount; i++) {
        const branch = branches[i % branches.length]
        await ClientFactory.merge({
          tenantId: tenant.id,
          branchId: branch?.id ?? null,
          createdBy: adminUser?.id ?? 1,
        }).create()
      }
    }
  }
}
