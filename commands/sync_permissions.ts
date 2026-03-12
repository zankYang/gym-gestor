// commands/sync_permissions.ts
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Permission from '#models/permission'
import { PermissionCode, PermissionModule } from '#enums/permissions_enum'

export default class SyncPermissions extends BaseCommand {
  static commandName = 'sync:permissions'
  static description = 'Sincroniza los permisos definidos en el Enum con la base de datos'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Iniciando sincronización de permisos...')

    const permissions = [
      {
        code: PermissionCode.USERS_MANAGE,
        name: 'Gestionar Usuarios',
        module: PermissionModule.AUTH,
        description: 'Administrar personal y accesos',
      },
      {
        code: PermissionCode.CLIENTS_READ,
        name: 'Ver Socios',
        module: PermissionModule.CLIENTS,
        description: 'Listado y búsqueda de miembros',
      },
      {
        code: PermissionCode.CLIENTS_WRITE,
        name: 'Editar Socios',
        module: PermissionModule.CLIENTS,
        description: 'Crear y modificar perfiles de socios',
      },
      {
        code: PermissionCode.PAYMENTS_WRITE,
        name: 'Registrar Cobros',
        module: PermissionModule.FINANCE,
        description: 'Procesar pagos de mensualidades',
      },
      {
        code: PermissionCode.PLANS_MANAGE,
        name: 'Gestionar Planes',
        module: PermissionModule.FINANCE,
        description: 'Configurar costos y beneficios de membresías',
      },
      {
        code: PermissionCode.ATTENDANCE_CHECKIN,
        name: 'Check-in Asistencia',
        module: PermissionModule.OPERATIONS,
        description: 'Registro de entrada/salida en sucursal',
      },
      {
        code: PermissionCode.SETTINGS_MANAGE,
        name: 'Ajustes del Sistema',
        module: PermissionModule.SYSTEM,
        description: 'Configuración global del tenant',
      },
    ]

    try {
      await Permission.updateOrCreateMany('code', permissions)
      this.logger.success(`Sincronizados ${permissions.length} permisos exitosamente.`)
    } catch (error) {
      this.logger.error('Error al sincronizar permisos: ' + error.message)
    }
  }
}
