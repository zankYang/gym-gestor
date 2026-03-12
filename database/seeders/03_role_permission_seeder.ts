import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'
import { Role as RoleEnum } from '#enums/role_enum'
import db from '@adonisjs/lucid/services/db'

const rolePermissions: Record<string, string[]> = {
  [RoleEnum.SUPERADMIN]: ['*'],
  [RoleEnum.ADMIN]: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'clients.view',
    'clients.create',
    'clients.edit',
    'clients.delete',
    'memberships.view',
    'memberships.create',
    'memberships.edit',
    'memberships.cancel',
    'membership_plans.view',
    'membership_plans.create',
    'membership_plans.edit',
    'membership_plans.delete',
    'payments.view',
    'payments.create',
    'payments.cancel',
    'attendances.view',
    'attendances.create',
    'trainers.view',
    'trainers.create',
    'trainers.edit',
    'trainers.delete',
    'routines.view',
    'routines.create',
    'routines.edit',
    'routines.delete',
    'classes.view',
    'classes.create',
    'classes.edit',
    'classes.delete',
    'classes.reservations',
    'branches.view',
    'branches.create',
    'branches.edit',
    'reports.view',
    'reports.export',
    'settings.view',
    'settings.edit',
    'documents.view',
    'documents.create',
    'documents.approve',
  ],
  [RoleEnum.RECEPTIONIST]: [
    'clients.view',
    'clients.create',
    'clients.edit',
    'memberships.view',
    'memberships.create',
    'memberships.edit',
    'memberships.cancel',
    'payments.view',
    'payments.create',
    'attendances.view',
    'attendances.create',
    'classes.view',
    'classes.reservations',
    'reports.view',
    'documents.view',
    'documents.create',
  ],
  [RoleEnum.TRAINER]: [
    'clients.view',
    'memberships.view',
    'attendances.view',
    'routines.view',
    'routines.create',
    'routines.edit',
    'classes.view',
    'classes.reservations',
    'documents.view',
  ],
}

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    const allPermissions = await Permission.all()
    const permissionMap = new Map(allPermissions.map((p) => [p.code, p.id]))

    for (const [roleCode, permCodes] of Object.entries(rolePermissions)) {
      const role = await Role.findByOrFail('code', roleCode)

      const targetCodes = permCodes[0] === '*' ? allPermissions.map((p) => p.code) : permCodes

      for (const code of targetCodes) {
        const permissionId = permissionMap.get(code)
        if (!permissionId) continue

        const exists = await db
          .from('role_permissions')
          .where('role_id', role.id)
          .where('permission_id', permissionId)
          .first()

        if (!exists) {
          await db.table('role_permissions').insert({
            role_id: role.id,
            permission_id: permissionId,
          })
        }
      }
    }
  }
}
