import { DateTime } from 'luxon'
import { BranchSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Tenant from '#models/tenant'
import User from '#models/user'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Payment from '#models/payment'
import Attendance from '#models/attendance'
import Trainer from '#models/trainer'
import GymClass from '#models/class'

export default class Branch extends BranchSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Branch, Branch> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Client)
  declare clients: HasMany<typeof Client>

  @hasMany(() => ClientMembership)
  declare clientMemberships: HasMany<typeof ClientMembership>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  @hasMany(() => Trainer)
  declare trainers: HasMany<typeof Trainer>

  @hasMany(() => GymClass)
  declare classes: HasMany<typeof GymClass>
}
