import { AttendanceSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Branch from '#models/branch'
import User from '#models/user'
import AttendanceEvent from '#models/attendance_event'

export default class Attendance extends AttendanceSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Attendance, Attendance> {
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

  @belongsTo(() => ClientMembership)
  declare clientMembership: BelongsTo<typeof ClientMembership>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @belongsTo(() => User, { foreignKey: 'registeredBy' })
  declare registeredByUser: BelongsTo<typeof User>

  @hasMany(() => AttendanceEvent)
  declare events: HasMany<typeof AttendanceEvent>
}
