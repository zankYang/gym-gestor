import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class MainSeeder extends BaseSeeder {
  private async load(seederPath: string) {
    const { default: Seeder } = await import(seederPath)
    await new Seeder(this.client).run()
  }

  async run() {
    // 1. Datos globales (sin tenant)
    await this.load(app.makePath('database/seeders/role_seeder.js'))
    await this.load(app.makePath('database/seeders/permission_seeder.js'))
    await this.load(app.makePath('database/seeders/role_permission_seeder.js'))
    await this.load(app.makePath('database/seeders/payment_method_seeder.js'))
    await this.load(app.makePath('database/seeders/document_type_seeder.js'))
    await this.load(app.makePath('database/seeders/exercise_catalog_seeder.js'))

    // 2. Tenants
    await this.load(app.makePath('database/seeders/gym_seeder.js'))

    // 3. Dependientes de tenant
    await this.load(app.makePath('database/seeders/branch_seeder.js'))
    await this.load(app.makePath('database/seeders/membership_plan_seeder.js'))
    await this.load(app.makePath('database/seeders/user_seeder.js'))

    // 4. Clientes y trainers
    await this.load(app.makePath('database/seeders/trainer_seeder.js'))
    await this.load(app.makePath('database/seeders/client_seeder.js'))

    // 5. Membresías y pagos
    await this.load(app.makePath('database/seeders/client_membership_seeder.js'))
    await this.load(app.makePath('database/seeders/payment_seeder.js'))

    // 6. Asistencias y configuración
    await this.load(app.makePath('database/seeders/attendance_seeder.js'))
    await this.load(app.makePath('database/seeders/setting_seeder.js'))
  }
}
