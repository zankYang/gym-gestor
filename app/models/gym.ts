import { GymSchema } from '#database/schema'
import Client from '#models/client'
import User from '#models/user'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Plan from '#models/plan'

export default class Gym extends GymSchema {
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Client)
  declare clients: HasMany<typeof Client>

  @hasMany(() => Plan)
  declare plans: HasMany<typeof Plan>
}
