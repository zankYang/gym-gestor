import { DateTime } from 'luxon'
import { TenantSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Branch from '#models/branch'
import User from '#models/user'
import Client from '#models/client'
import MembershipPlan from '#models/membership_plan'
import Trainer from '#models/trainer'
import Payment from '#models/payment'
import Routine from '#models/routine'
import GymClass from '#models/class'
import Notification from '#models/notification'
import Setting from '#models/setting'

export default class Tenant extends TenantSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Tenant, Tenant> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  @hasMany(() => Branch)
  declare branches: HasMany<typeof Branch>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Client)
  declare clients: HasMany<typeof Client>

  @hasMany(() => MembershipPlan)
  declare membershipPlans: HasMany<typeof MembershipPlan>

  @hasMany(() => Trainer)
  declare trainers: HasMany<typeof Trainer>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => Routine)
  declare routines: HasMany<typeof Routine>

  @hasMany(() => GymClass)
  declare classes: HasMany<typeof GymClass>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Setting)
  declare settings: HasMany<typeof Setting>
}
