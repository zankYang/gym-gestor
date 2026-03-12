import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Setting from '#models/setting'
import Tenant from '#models/tenant'
import db from '@adonisjs/lucid/services/db'

const defaultSettings = [
  {
    key: 'timezone',
    value: 'America/Bogota',
    description: 'Zona horaria del gimnasio',
  },
  {
    key: 'currency',
    value: 'COP',
    description: 'Moneda utilizada para pagos',
  },
  {
    key: 'membership_expiry_alert_days',
    value: 5,
    description: 'Días de anticipación para alertar sobre vencimiento de membresía',
  },
  {
    key: 'allow_multiple_active_memberships',
    value: false,
    description: 'Permitir que un cliente tenga más de una membresía activa simultáneamente',
  },
  {
    key: 'attendance_auto_checkout_hours',
    value: 4,
    description: 'Horas tras las cuales se registra salida automática si no se hizo checkout',
  },
  {
    key: 'max_class_reservations_per_client',
    value: 3,
    description: 'Número máximo de reservas activas por cliente',
  },
  {
    key: 'reservation_cancel_hours_limit',
    value: 2,
    description: 'Horas mínimas de anticipación para cancelar una reserva de clase',
  },
  {
    key: 'logo_url',
    value: null,
    description: 'URL del logo del gimnasio',
  },
  {
    key: 'welcome_message',
    value: 'Bienvenido a nuestro gimnasio',
    description: 'Mensaje de bienvenida para nuevos clientes',
  },
  {
    key: 'notifications_enabled',
    value: true,
    description: 'Habilitar el envío de notificaciones automáticas',
  },
]

export default class SettingSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.all()

    for (const tenant of tenants) {
      for (const setting of defaultSettings) {
        const exists = await Setting.query()
          .where('tenant_id', tenant.id)
          .where('key', setting.key)
          .first()

        if (exists) continue

        await db.table('settings').insert({
          tenant_id: tenant.id,
          key: setting.key,
          value: JSON.stringify(setting.value),
          description: setting.description,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    }
  }
}
