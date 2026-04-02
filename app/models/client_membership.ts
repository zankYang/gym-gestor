import { DateTime } from 'luxon'
import { ClientMembershipSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import Client from '#models/client'
import MembershipPlan from '#models/membership_plan'
import Branch from '#models/branch'
import User from '#models/user'
import Payment from '#models/payment'
import Attendance from '#models/attendance'

export default class ClientMembership extends ClientMembershipSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof ClientMembership, ClientMembership> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => MembershipPlan)
  declare membershipPlan: BelongsTo<typeof MembershipPlan>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare createdByUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'updatedBy' })
  declare updatedByUser: BelongsTo<typeof User>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>
}
