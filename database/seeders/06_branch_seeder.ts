import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Branch from '#models/branch'
import Tenant from '#models/tenant'
import { Status } from '#enums/status_enum'

export default class BranchSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.all()

    for (const tenant of tenants) {
      const branchCount = tenant.status === Status.ACTIVE ? 2 : 1

      for (let i = 1; i <= branchCount; i++) {
        const code = `${tenant.slug.toUpperCase().replace(/-/g, '').slice(0, 4)}${i}`
        await Branch.firstOrCreate(
          { tenantId: tenant.id, code },
          {
            tenantId: tenant.id,
            name: `${tenant.name} - Sucursal ${i}`,
            code,
            status: tenant.status,
          }
        )
      }
    }
  }
}
