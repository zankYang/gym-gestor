import { UserFactory } from '#database/factories/user_factory'
import { Role } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const users: { password: string; role: Role; status: Status }[] = [
      { password: '123456', role: Role.ADMIN, status: Status.ACTIVE },
      { password: '123456', role: Role.RECEPTIONIST, status: Status.ACTIVE },
      { password: '123456', role: Role.TRAINER, status: Status.ACTIVE },
    ]

    for (const user of users) {
      await UserFactory.merge({
        password: await hash.make(user.password),
        role: user.role,
        status: user.status,
      }).create()
    }
  }
}
