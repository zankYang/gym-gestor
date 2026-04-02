import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Attendance from '#models/attendance'
import Tenant from '#models/tenant'
import Client from '#models/client'
import User from '#models/user'

export default class AttendanceEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tenantId: number

  @column()
  declare attendanceId: number

  @column()
  declare clientId: number

  @column()
  declare eventType: string

  @column.dateTime()
  declare eventAt: DateTime

  @column()
  declare registeredBy: number

  @column()
  declare notes: string | null

  @column()
  declare metadata: Record<string, unknown> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Attendance)
  declare attendance: BelongsTo<typeof Attendance>

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => User, { foreignKey: 'registeredBy' })
  declare registeredByUser: BelongsTo<typeof User>
}
