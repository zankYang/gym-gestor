import { DateTime } from 'luxon'
import { GymSchema } from '#database/schema'
import Client from '#models/client'
import User from '#models/user'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Plan from '#models/plan'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class Gym extends GymSchema {
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Client)
  declare clients: HasMany<typeof Client>

  @hasMany(() => Plan)
  declare plans: HasMany<typeof Plan>

  /**
   * Query solo gyms no borrados (deleted_at null).
   * Usar en listados y búsquedas para no incluir dados de baja.
   */
  static notDeleted(): ModelQueryBuilderContract<typeof Gym, Gym> {
    return this.query().whereNull('deleted_at')
  }

  /**
   * Borrado lógico: marca deleted_at y guarda. El registro sigue en BD pero se excluye de notDeleted().
   */
  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }
}
