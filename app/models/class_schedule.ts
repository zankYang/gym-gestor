import { ClassScheduleSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import GymClass from '#models/class'
import ClassReservation from '#models/class_reservation'

export default class ClassSchedule extends ClassScheduleSchema {
  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => GymClass, { foreignKey: 'classId' })
  declare gymClass: BelongsTo<typeof GymClass>

  @hasMany(() => ClassReservation)
  declare reservations: HasMany<typeof ClassReservation>
}
