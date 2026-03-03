import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { GymFactory } from '#database/factories/gym_factory'

export default class GymSeeder extends BaseSeeder {
  async run() {
    const gyms: { name: string; slug: string; status: 'active' | 'inactive' | 'suspended' }[] = [
      { name: 'Gym Activo Norte', slug: 'gym-activo-norte', status: 'active' },
      { name: 'Gym Activo Sur', slug: 'gym-activo-sur', status: 'active' },
      { name: 'Gym Pausado Centro', slug: 'gym-pausado-centro', status: 'inactive' },
      { name: 'Gym Pausado Este', slug: 'gym-pausado-este', status: 'inactive' },
      { name: 'Gym Suspendido Oeste', slug: 'gym-suspendido-oeste', status: 'suspended' },
    ]

    for (const gym of gyms) {
      await GymFactory.merge({ name: gym.name, slug: gym.slug, status: gym.status }).create()
    }
  }
}
