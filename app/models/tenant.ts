import { DateTime } from 'luxon'
import { TenantSchema } from '#database/schema'
import { beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Branch from '#models/branch'
import User from '#models/user'
import Client from '#models/client'
import MembershipPlan from '#models/membership_plan'
import Trainer from '#models/trainer'
import Payment from '#models/payment'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import Routine from '#models/routine'
import GymClass from '#models/class'
import Notification from '#models/notification'
import Setting from '#models/setting'
import { Status } from '#enums/status_enum'
export default class Tenant extends TenantSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Tenant, Tenant> {
    return this.query().whereNull('deleted_at')
  }

  @beforeCreate()
  static assignDefaultStatus(tenant: Tenant) {
    tenant.status = tenant.status ?? Status.ACTIVE
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

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  @hasMany(() => AttendanceEvent)
  declare attendanceEvents: HasMany<typeof AttendanceEvent>

  @hasMany(() => Routine)
  declare routines: HasMany<typeof Routine>

  @hasMany(() => GymClass)
  declare classes: HasMany<typeof GymClass>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Setting)
  declare settings: HasMany<typeof Setting>
}
