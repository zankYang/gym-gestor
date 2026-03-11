import { RoutineExerciseSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Routine from '#models/routine'
import ExerciseCatalog from '#models/exercise_catalog'

export default class RoutineExercise extends RoutineExerciseSchema {
  @belongsTo(() => Routine)
  declare routine: BelongsTo<typeof Routine>

  @belongsTo(() => ExerciseCatalog)
  declare exerciseCatalog: BelongsTo<typeof ExerciseCatalog>
}
