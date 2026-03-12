import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TrainerFactory } from '#database/factories/trainer_factory'
import Tenant from '#models/tenant'
import Branch from '#models/branch'
import { Status } from '#enums/status_enum'

export default class TrainerSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.query().where('status', Status.ACTIVE)

    for (const tenant of tenants) {
      const branches = await Branch.query().where('tenant_id', tenant.id)
      const trainerCount = 3

      for (let i = 0; i < trainerCount; i++) {
        const branch = branches[i % branches.length]
        await TrainerFactory.merge({
          tenantId: tenant.id,
          branchId: branch?.id ?? null,
        }).create()
      }
    }
  }
}
