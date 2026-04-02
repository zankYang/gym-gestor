import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TenantFactory } from '#factories/tenant_factory'
import { Status } from '#enums/status_enum'

export default class GymSeeder extends BaseSeeder {
  async run() {
    const gyms: { name: string; slug: string; status: Status }[] = [
      { name: 'Gym Activo Norte', slug: 'gym-activo-norte', status: Status.ACTIVE },
      { name: 'Gym Activo Sur', slug: 'gym-activo-sur', status: Status.ACTIVE },
      { name: 'Gym Pausado Centro', slug: 'gym-pausado-centro', status: Status.INACTIVE },
      { name: 'Gym Pausado Este', slug: 'gym-pausado-este', status: Status.INACTIVE },
      { name: 'Gym Suspendido Oeste', slug: 'gym-suspendido-oeste', status: Status.SUSPENDED },
    ]

    for (const gym of gyms) {
      await TenantFactory.merge({
        slug: gym.slug,
        name: gym.name,
        status: gym.status,
      }).create()
    }
  }
}
