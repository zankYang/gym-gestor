// commands/sync_roles.ts
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Role from '#models/role'
import Permission from '#models/permission'
import { RoleCode } from '#enums/role_enum'
import { PermissionCode } from '#enums/permissions_enum'

export default class SyncRoles extends BaseCommand {
  static commandName = 'sync:roles'
  static description = 'Sincroniza los roles y asigna sus permisos base'

  static options: CommandOptions = { startApp: true }

  async run() {
    this.logger.info('Sincronizando roles y permisos...')

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
        description: 'Gestión total de su propio gimnasio (Tenant)',
        permissions: [
          PermissionCode.USERS_MANAGE,
          PermissionCode.CLIENTS_READ,
          PermissionCode.CLIENTS_WRITE,
          PermissionCode.PAYMENTS_WRITE,
          PermissionCode.PLANS_MANAGE,
          PermissionCode.ATTENDANCE_CHECKIN,
          PermissionCode.SETTINGS_MANAGE,
        ],
      },
      {
        code: RoleCode.RECEPTIONIST,
        name: 'Recepcionista',
        description: 'Gestión de socios, cobros y asistencia diaria',
        permissions: [
          PermissionCode.CLIENTS_READ,
          PermissionCode.CLIENTS_WRITE,
          PermissionCode.PAYMENTS_WRITE,
          PermissionCode.ATTENDANCE_CHECKIN,
        ],
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
          `Atención: Para el rol [${config.code}], se esperaban ${config.permissions.length} permisos pero solo se encontraron ${permissionIds.length} en la DB. ¡Corre sync:permissions primero!`
        )
      }

      await role.related('permissions').sync(permissionIds)

      this.logger.success(`Rol [${config.code}] sincronizado con ${permissionIds.length} permisos.`)
    }
  }
}
