import { BaseCommand, flags } from '@adonisjs/core/ace'
import User from '#models/user'
import Role from '#models/role'
import hash from '@adonisjs/core/services/hash'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { Status } from '#enums/status_enum'
import { RoleCode } from '#enums/role_enum'

export default class CreateSuperadmin extends BaseCommand {
  static commandName = 'create:superadmin'
  static description = 'Crear un usuario con rol superadmin (solo para uso inicial o recuperación)'
  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({
    description: 'Email del superadmin',
    alias: 'e',
    default: 'superadmin@gymgestor.com',
  })
  declare email: string

  @flags.string({ description: 'Nombre', alias: 'n', default: 'Super' })
  declare firstName: string

  @flags.string({ description: 'Apellido', alias: 'l', default: 'Admin' })
  declare lastName: string

  @flags.string({
    description: 'Contraseña (mínimo 8 caracteres)',
    alias: 'p',
    default: 'admin2026',
  })
  declare password: string

  @flags.number({
    description: 'ID del tenant al que pertenece el superadmin',
    alias: 't',
  })
  declare tenantId: number

  async run() {
    if (!this.email?.trim()) {
      this.logger.error('El flag --email es obligatorio.')
      this.exitCode = 1
      return
    }
    if (!this.password || this.password.length < 8) {
      this.logger.error('El flag --password es obligatorio y debe tener al menos 8 caracteres.')
      this.exitCode = 1
      return
    }

    const existing = await User.query().where('email', this.email).first()
    if (existing) {
      this.logger.error(`Ya existe un usuario con el email "${this.email}".`)
      this.exitCode = 1
      return
    }

    const superadminRole = await Role.findBy('code', RoleCode.SUPERADMIN)
    if (!superadminRole) {
      this.logger.error(
        'No se encontró el rol superadmin en la base de datos. Ejecuta los seeders primero.'
      )
      this.exitCode = 1
      return
    }

    const passwordHash = await hash.make(this.password)

    const user = await User.create({
      tenantId: this.tenantId,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      passwordHash,
      roleId: superadminRole.id,
      status: Status.ACTIVE,
    })

    this.logger.success(`Superadmin creado: ${user.email} (id: ${user.id})`)
  }
}
