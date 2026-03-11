import { RoleSchema } from '#database/schema'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Permission from '#models/permission'

export default class Role extends RoleSchema {
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    pivotTimestamps: { createdAt: true, updatedAt: false },
  })
  declare permissions: ManyToMany<typeof Permission>
}
