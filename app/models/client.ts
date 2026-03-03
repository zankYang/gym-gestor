import { ClientSchema } from '#database/schema'
import Gym from '#models/gym'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Plan from '#models/plan'

export default class Client extends ClientSchema {
  @belongsTo(() => Gym)
  declare gym: BelongsTo<typeof Gym>

  @hasMany(() => Plan)
  declare plans: HasMany<typeof Plan>
}
