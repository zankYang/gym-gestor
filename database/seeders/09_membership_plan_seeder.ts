import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tenant from '#models/tenant'
import MembershipPlan from '#models/membership_plan'
import { Status } from '#enums/status_enum'

export default class MembershipPlanSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.all()

    const planTemplates = [
      {
        name: 'Plan Mensual',
        code: 'MENSUAL',
        description: 'Acceso ilimitado al gimnasio durante 30 días',
        durationDays: 30,
        price: '50.00',
        allowsClasses: false,
        allowsFreeze: false,
        freezeDaysLimit: 0,
        status: Status.ACTIVE,
      },
      {
        name: 'Plan Mensual + Clases',
        code: 'MENSUAL_CLASES',
        description: 'Acceso ilimitado al gimnasio y clases grupales durante 30 días',
        durationDays: 30,
        price: '70.00',
        allowsClasses: true,
        allowsFreeze: true,
        freezeDaysLimit: 5,
        status: Status.ACTIVE,
      },
      {
        name: 'Plan Trimestral',
        code: 'TRIMESTRAL',
        description: 'Acceso ilimitado al gimnasio durante 90 días',
        durationDays: 90,
        price: '130.00',
        allowsClasses: false,
        allowsFreeze: true,
        freezeDaysLimit: 10,
        status: Status.ACTIVE,
      },
      {
        name: 'Plan Anual',
        code: 'ANUAL',
        description: 'Acceso ilimitado al gimnasio durante 365 días con máximos beneficios',
        durationDays: 365,
        price: '450.00',
        allowsClasses: true,
        allowsFreeze: true,
        freezeDaysLimit: 30,
        status: Status.ACTIVE,
      },
      {
        name: 'Visita única',
        code: 'VISITA',
        description: 'Acceso por un día',
        durationDays: 1,
        price: '10.00',
        allowsClasses: false,
        allowsFreeze: false,
        freezeDaysLimit: 0,
        status: Status.ACTIVE,
      },
    ]

    for (const tenant of tenants) {
      for (const template of planTemplates) {
        await MembershipPlan.firstOrCreate(
          { tenantId: tenant.id, code: template.code },
          { ...template, tenantId: tenant.id }
        )
      }
    }
  }
}
