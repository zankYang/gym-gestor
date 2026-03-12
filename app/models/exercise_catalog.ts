import { ExerciseCatalogSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RoutineExercise from '#models/routine_exercise'

export default class ExerciseCatalog extends ExerciseCatalogSchema {
  @hasMany(() => RoutineExercise)
  declare routineExercises: HasMany<typeof RoutineExercise>
}
