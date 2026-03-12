import { PermissionSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'

export default class Permission extends PermissionSchema {
  @manyToMany(() => Role, {
    pivotTable: 'role_permissions',
    pivotTimestamps: { createdAt: true, updatedAt: false },
  })
  declare roles: ManyToMany<typeof Role>
}
