import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { GymFactory } from '#database/factories/gym_factory'
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
      await GymFactory.merge({ name: gym.name, slug: gym.slug, status: gym.status }).create()
    }
  }
}
