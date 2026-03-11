import { DateTime } from 'luxon'
import { TrainerSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Tenant from '#models/tenant'
import User from '#models/user'
import Branch from '#models/branch'
import Routine from '#models/routine'
import GymClass from '#models/class'

export default class Trainer extends TrainerSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Trainer, Trainer> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @hasMany(() => Routine)
  declare routines: HasMany<typeof Routine>

  @hasMany(() => GymClass)
  declare classes: HasMany<typeof GymClass>
}
