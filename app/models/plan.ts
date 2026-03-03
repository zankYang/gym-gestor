import { PlanSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Gym from '#models/gym'

export default class Plan extends PlanSchema {
  @belongsTo(() => Gym)
  declare gym: BelongsTo<typeof Gym>

  @hasMany(() => Client)
  declare clients: HasMany<typeof Client>
}
