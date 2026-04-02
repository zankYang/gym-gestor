import { RoleSchema } from '#database/schema'
import { hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Permission from '#models/permission'
import { RoleCode } from '#enums/role_enum'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class Role extends RoleSchema {
  public static withoutSuperadmin = scope((query: ModelQueryBuilderContract<typeof Role>) => {
    query.whereNot('code', RoleCode.SUPERADMIN)
  })

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    pivotTimestamps: { createdAt: true, updatedAt: false },
  })
  declare permissions: ManyToMany<typeof Permission>
}
