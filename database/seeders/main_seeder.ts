import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class MainSeeder extends BaseSeeder {
  private async load(seederPath: string) {
    const { default: Seeder } = await import(seederPath)
    await new Seeder(this.client).run()
  }

  async run() {
    // Datos globales (sin tenant)
    await this.load(app.makePath('database/seeders/01_role_seeder.js'))
    await this.load(app.makePath('database/seeders/02_permission_seeder.js'))
    await this.load(app.makePath('database/seeders/03_role_permission_seeder.js'))
    await this.load(app.makePath('database/seeders/04_payment_method_seeder.js'))
    await this.load(app.makePath('database/seeders/05_document_type_seeder.js'))
    await this.load(app.makePath('database/seeders/06_exercise_catalog_seeder.js'))

    // Tenants
    await this.load(app.makePath('database/seeders/07_gym_seeder.js'))

    // Dependientes de tenant
    await this.load(app.makePath('database/seeders/08_branch_seeder.js'))
    await this.load(app.makePath('database/seeders/09_membership_plan_seeder.js'))
    await this.load(app.makePath('database/seeders/10_user_seeder.js'))

    // Clientes y trainers
    await this.load(app.makePath('database/seeders/11_trainer_seeder.js'))
    await this.load(app.makePath('database/seeders/12_client_seeder.js'))

    // Membresías y pagos
    await this.load(app.makePath('database/seeders/13_client_membership_seeder.js'))
    await this.load(app.makePath('database/seeders/14_payment_seeder.js'))

    // Asistencias y configuración
    await this.load(app.makePath('database/seeders/15_attendance_seeder.js'))
    await this.load(app.makePath('database/seeders/16_setting_seeder.js'))
  }
}
