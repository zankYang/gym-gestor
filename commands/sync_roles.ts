import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Role from '#models/role'
import Permission from '#models/permission'
import { RoleCode } from '#enums/role_enum'
import { PermissionCode } from '#enums/permissions_enum'

export default class SyncRoles extends BaseCommand {
  static commandName = 'sync:roles'
  static description =
    'Sincroniza los roles y asigna sus permisos base (requiere sync:permissions previo)'

  static options: CommandOptions = { startApp: true }

  async run() {
    this.logger.info('Sincronizando roles y permisos...')

    // Permisos exclusivos del admin dentro de su tenant (gestión completa)
    const ADMIN_PERMISSIONS: PermissionCode[] = [
      PermissionCode.USERS_MANAGE,
      PermissionCode.ROLES_MANAGE,
      PermissionCode.CLIENTS_READ,
      PermissionCode.CLIENTS_WRITE,
      PermissionCode.CLIENTS_DELETE,
      PermissionCode.MEMBERSHIPS_MANAGE,
      PermissionCode.PAYMENTS_READ,
      PermissionCode.PAYMENTS_WRITE,
      PermissionCode.PAYMENTS_CANCEL,
      PermissionCode.PLANS_MANAGE,
      PermissionCode.ATTENDANCE_CHECKIN,
      PermissionCode.ATTENDANCES_VIEW,
      PermissionCode.BRANCH_MANAGE,
      PermissionCode.CLASSES_MANAGE,
      PermissionCode.TRAINERS_MANAGE,
      PermissionCode.ROUTINES_MANAGE,
      PermissionCode.CATALOG_MANAGE,
      PermissionCode.SETTINGS_MANAGE,
      PermissionCode.AUDIT_VIEW,
      PermissionCode.REPORTS_VIEW,
      PermissionCode.DOCUMENTS_MANAGE,
      PermissionCode.NOTIFICATIONS_MANAGE,
    ]

    // Operaciones del día a día: socios, cobros, membresías y asistencia
    const RECEPTIONIST_PERMISSIONS: PermissionCode[] = [
      PermissionCode.CLIENTS_READ,
      PermissionCode.CLIENTS_WRITE,
      PermissionCode.MEMBERSHIPS_MANAGE,
      PermissionCode.PAYMENTS_READ,
      PermissionCode.PAYMENTS_WRITE,
      PermissionCode.PLANS_MANAGE,
      PermissionCode.ATTENDANCE_CHECKIN,
      PermissionCode.ATTENDANCES_VIEW,
    ]

    // Entrenamiento: socios, asistencia, rutinas y clases grupales
    const COACH_PERMISSIONS: PermissionCode[] = [
      PermissionCode.CLIENTS_READ,
      PermissionCode.ATTENDANCE_CHECKIN,
      PermissionCode.ATTENDANCES_VIEW,
      PermissionCode.ROUTINES_MANAGE,
      PermissionCode.CLASSES_MANAGE,
      PermissionCode.CATALOG_MANAGE,
    ]

    const rolesConfig = [
      {
        code: RoleCode.SUPERADMIN,
        name: 'Super Administrador',
        description: 'Control total global del sistema',
        permissions: Object.values(PermissionCode),
      },
      {
        code: RoleCode.ADMIN,
        name: 'Administrador de Gimnasio',
        description: 'Gestión total de su propio gimnasio (tenant)',
        permissions: ADMIN_PERMISSIONS,
      },
      {
        code: RoleCode.RECEPTIONIST,
        name: 'Recepcionista',
        description: 'Gestión de socios, cobros y asistencia diaria',
        permissions: RECEPTIONIST_PERMISSIONS,
      },
      {
        code: RoleCode.COACH,
        name: 'Entrenador',
        description: 'Gestión de entrenamientos y asistencia de socios',
        permissions: COACH_PERMISSIONS,
      },
    ]

    for (const config of rolesConfig) {
      const role = await Role.updateOrCreate(
        { code: config.code },
        {
          name: config.name,
          description: config.description,
        }
      )

      const permissions = await Permission.query().whereIn('code', config.permissions)
      const permissionIds = permissions.map((p) => p.id)

      if (permissionIds.length !== config.permissions.length) {
        this.logger.warning(
          `Rol [${config.code}]: se esperaban ${config.permissions.length} permisos pero solo se encontraron ${permissionIds.length} en la DB. Ejecuta node ace sync:permissions primero.`
        )
      }

      await role.related('permissions').sync(permissionIds)

      this.logger.success(`Rol [${config.code}] sincronizado con ${permissionIds.length} permisos.`)
    }

    this.logger.info('Sincronización de roles completada.')
  }
}
