import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import { Role as RoleEnum } from '#enums/role_enum'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    const roles = [
      {
        name: RoleEnum.SUPERADMIN,
        code: RoleEnum.SUPERADMIN,
        description: 'Acceso total al sistema, gestión de todos los tenants',
      },
      {
        name: RoleEnum.ADMIN,
        code: RoleEnum.ADMIN,
        description: 'Administrador del gimnasio, acceso completo dentro del tenant',
      },
      {
        name: RoleEnum.RECEPTIONIST,
        code: RoleEnum.RECEPTIONIST,
        description: 'Gestión de clientes, cobros y asistencias',
      },
      {
        name: RoleEnum.TRAINER,
        code: RoleEnum.TRAINER,
        description: 'Gestión de rutinas y clases',
      },
    ]

    for (const role of roles) {
      await Role.firstOrCreate({ code: role.code }, role)
    }
  }
}
