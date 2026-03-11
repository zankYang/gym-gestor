import { DateTime } from 'luxon'
import { RoutineSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Tenant from '#models/tenant'
import Client from '#models/client'
import Trainer from '#models/trainer'
import User from '#models/user'
import RoutineExercise from '#models/routine_exercise'

export default class Routine extends RoutineSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Routine, Routine> {
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

  @belongsTo(() => Trainer)
  declare trainer: BelongsTo<typeof Trainer>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare createdByUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'updatedBy' })
  declare updatedByUser: BelongsTo<typeof User>

  @hasMany(() => RoutineExercise)
  declare routineExercises: HasMany<typeof RoutineExercise>
}
