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
      // --- auth ---
      {
        code: PermissionCode.USERS_MANAGE,
        name: 'Gestionar Usuarios',
        module: PermissionModule.AUTH,
        description: 'Administrar personal y accesos',
      },
      {
        code: PermissionCode.ROLES_MANAGE,
        name: 'Gestionar Roles',
        module: PermissionModule.AUTH,
        description: 'Asignar y modificar roles de usuarios',
      },

      // --- clients ---
      {
        code: PermissionCode.CLIENTS_READ,
        name: 'Ver Socios',
        module: PermissionModule.CLIENTS,
        description: 'Listado y búsqueda de socios',
      },
      {
        code: PermissionCode.CLIENTS_WRITE,
        name: 'Editar Socios',
        module: PermissionModule.CLIENTS,
        description: 'Crear y modificar perfiles de socios',
      },
      {
        code: PermissionCode.CLIENTS_DELETE,
        name: 'Eliminar Socios',
        module: PermissionModule.CLIENTS,
        description: 'Dar de baja o eliminar socios',
      },
      {
        code: PermissionCode.MEMBERSHIPS_MANAGE,
        name: 'Gestionar Membresías',
        module: PermissionModule.CLIENTS,
        description: 'Alta, renovación y cancelación de membresías de socios',
      },

      // --- finance ---
      {
        code: PermissionCode.PAYMENTS_READ,
        name: 'Ver Cobros',
        module: PermissionModule.FINANCE,
        description: 'Consultar historial de pagos',
      },
      {
        code: PermissionCode.PAYMENTS_WRITE,
        name: 'Registrar Cobros',
        module: PermissionModule.FINANCE,
        description: 'Procesar pagos de mensualidades',
      },
      {
        code: PermissionCode.PAYMENTS_CANCEL,
        name: 'Anular Pago',
        module: PermissionModule.FINANCE,
        description: 'Anular o revertir pagos registrados',
      },
      {
        code: PermissionCode.PLANS_MANAGE,
        name: 'Gestionar Planes',
        module: PermissionModule.FINANCE,
        description: 'Configurar costos y beneficios de membresías',
      },

      // --- operations ---
      {
        code: PermissionCode.ATTENDANCE_CHECKIN,
        name: 'Check-in Asistencia',
        module: PermissionModule.OPERATIONS,
        description: 'Registrar entrada/salida de socios en sucursal',
      },
      {
        code: PermissionCode.ATTENDANCES_VIEW,
        name: 'Ver Asistencias',
        module: PermissionModule.OPERATIONS,
        description: 'Consultar historial de asistencias',
      },
      {
        code: PermissionCode.BRANCH_MANAGE,
        name: 'Gestionar Sucursales',
        module: PermissionModule.OPERATIONS,
        description: 'Crear y configurar sucursales',
      },

      // --- fitness ---
      {
        code: PermissionCode.CLASSES_MANAGE,
        name: 'Gestionar Clases',
        module: PermissionModule.FITNESS,
        description: 'Crear horarios y clases grupales',
      },
      {
        code: PermissionCode.TRAINERS_MANAGE,
        name: 'Gestionar Entrenadores',
        module: PermissionModule.FITNESS,
        description: 'Alta y asignación de entrenadores',
      },

      // --- workout ---
      {
        code: PermissionCode.ROUTINES_MANAGE,
        name: 'Gestionar Rutinas',
        module: PermissionModule.WORKOUT,
        description: 'Crear y asignar rutinas de entrenamiento',
      },
      {
        code: PermissionCode.CATALOG_MANAGE,
        name: 'Gestionar Catálogo',
        module: PermissionModule.WORKOUT,
        description: 'Catálogo de ejercicios y materiales',
      },

      // --- system ---
      {
        code: PermissionCode.SETTINGS_MANAGE,
        name: 'Ajustes del Sistema',
        module: PermissionModule.SYSTEM,
        description: 'Configuración global del tenant',
      },
      {
        code: PermissionCode.AUDIT_VIEW,
        name: 'Ver Auditoría',
        module: PermissionModule.SYSTEM,
        description: 'Consultar registros de auditoría',
      },
      {
        code: PermissionCode.REPORTS_VIEW,
        name: 'Ver Reportes',
        module: PermissionModule.SYSTEM,
        description: 'Acceder a reportes y estadísticas del gimnasio',
      },
      {
        code: PermissionCode.DOCUMENTS_MANAGE,
        name: 'Gestionar Documentos',
        module: PermissionModule.SYSTEM,
        description: 'Subir y gestionar documentos del tenant',
      },
      {
        code: PermissionCode.NOTIFICATIONS_MANAGE,
        name: 'Gestionar Notificaciones',
        module: PermissionModule.SYSTEM,
        description: 'Enviar y gestionar notificaciones a socios',
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
