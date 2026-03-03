import { BaseCommand, flags } from '@adonisjs/core/ace'
import User from '#models/user'
import Gym from '#models/gym'

export default class CreateSuperadmin extends BaseCommand {
  static commandName = 'create:superadmin'
  static description = 'Crear un usuario con rol superadmin (solo para uso inicial o recuperación)'

  @flags.string({ description: 'Email del superadmin' })
  declare email: string

  @flags.string({ description: 'Nombre completo' })
  declare fullName: string

  @flags.string({ description: 'Contraseña (mínimo 8 caracteres)' })
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

    const gym = await Gym.notDeleted().select('id').first()
    if (!gym) {
      this.logger.error('No hay ningún gym en la base de datos. Crea uno antes (seeders o API).')
      this.exitCode = 1
      return
    }

    const existing = await User.query().where('email', this.email).first()
    if (existing) {
      this.logger.error(`Ya existe un usuario con el email "${this.email}".`)
      this.exitCode = 1
      return
    }

    const user = await User.create({
      gymId: gym!.id,
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password,
      role: 'superadmin',
      status: 'active',
    })

    this.logger.success(`Superadmin creado: ${user.email} (id: ${user.id})`)
  }
}
