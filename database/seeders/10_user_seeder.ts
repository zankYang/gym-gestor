import Role from '#models/role'
import Tenant from '#models/tenant'
import User from '#models/user'
import { Role as RoleEnum } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const adminRole = await Role.findByOrFail('code', RoleEnum.ADMIN)
    const receptionistRole = await Role.findByOrFail('code', RoleEnum.RECEPTIONIST)
    const trainerRole = await Role.findByOrFail('code', RoleEnum.TRAINER)

    const tenants = await Tenant.all()

    for (const tenant of tenants) {
      const users: { email: string; password: string; roleId: number }[] = [
        {
          email: `admin.${tenant.slug}@gymgestor.com`,
          password: '12345678',
          roleId: adminRole.id,
        },
        {
          email: `recepcion.${tenant.slug}@gymgestor.com`,
          password: '12345678',
          roleId: receptionistRole.id,
        },
        {
          email: `entrenador.${tenant.slug}@gymgestor.com`,
          password: '12345678',
          roleId: trainerRole.id,
        },
      ]

      for (const user of users) {
        await User.firstOrCreate(
          { tenantId: tenant.id, email: user.email },
          {
            tenantId: tenant.id,
            email: user.email,
            passwordHash: await hash.make(user.password),
            roleId: user.roleId,
            firstName: user.email.split('.')[0],
            lastName: 'Gymgestor',
            status: Status.ACTIVE,
          }
        )
      }
    }
  }
}
