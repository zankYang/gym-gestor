import { ClassReservationSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import ClassSchedule from '#models/class_schedule'
import Client from '#models/client'

export default class ClassReservation extends ClassReservationSchema {
  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => ClassSchedule)
  declare classSchedule: BelongsTo<typeof ClassSchedule>

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>
}
