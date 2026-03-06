import { BaseCommand, flags } from '@adonisjs/core/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { Status } from '#enums/status_enum'
import { Role } from '#enums/role_enum'

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

  @flags.string({ description: 'Nombre completo', alias: 'n', default: 'superadmin' })
  declare fullName: string

  @flags.string({
    description: 'Contraseña (mínimo 8 caracteres)',
    alias: 'p',
    default: 'admin2026',
  })
  declare password: string

  async run() {
    if (!this.email?.trim()) {
      this.logger.error('El flag --email es obligatorio.')
      this.exitCode = 1
      return
    }
    if (!this.fullName?.trim()) {
      this.logger.error('El flag --fullName es obligatorio.')
      this.exitCode = 1
      return
    }
    if (!this.password || this.password.length < 8) {
      this.logger.error('El flag --password es obligatorio y debe tener al menos 8 caracteres.')
      this.exitCode = 1
      return
    }

    const existing = await User.query().whereNull('gym_id').where('email', this.email).first()
    if (existing) {
      this.logger.error(`Ya existe un superadmin con el email "${this.email}".`)
      this.exitCode = 1
      return
    }

    const password = await hash.make(this.password)

    const user = await User.create({
      gymId: null,
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password,
      role: Role.SUPERADMIN,
      status: Status.ACTIVE,
    })

    this.logger.success(`Superadmin creado: ${user.email} (id: ${user.id})`)
  }
}
