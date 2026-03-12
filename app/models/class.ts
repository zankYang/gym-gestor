import { ClassSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import Branch from '#models/branch'
import Trainer from '#models/trainer'
import ClassSchedule from '#models/class_schedule'

export default class GymClass extends ClassSchema {
  static table = 'classes'

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @belongsTo(() => Trainer)
  declare trainer: BelongsTo<typeof Trainer>

  @hasMany(() => ClassSchedule)
  declare schedules: HasMany<typeof ClassSchedule>
}
