import { UserFactory } from '#database/factories/user_factory'
import { Role } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const users: { email: string; password: string; role: Role }[] = [
      { email: 'admin@gymgestor.com', password: '12345678', role: Role.ADMIN },
      { email: 'user@gymgestor.com', password: '12345678', role: Role.RECEPTIONIST },
      { email: 'user2@gymgestor.com', password: '12345678', role: Role.TRAINER },
    ]

    for (const user of users) {
      await UserFactory.merge({
        email: user.email,
        password: await hash.make(user.password),
        role: user.role,
        status: Status.ACTIVE,
      }).create()
    }
  }
}
