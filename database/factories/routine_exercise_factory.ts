import factory from '@adonisjs/lucid/factories'
import RoutineExercise from '#models/routine_exercise'

const DAY_LABELS = ['Día A', 'Día B', 'Día C', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

export const RoutineExerciseFactory = factory
  .define(RoutineExercise, ({ faker }) => {
    return {
      routineId: 1,
      exerciseCatalogId: 1,
      dayLabel: faker.helpers.arrayElement(DAY_LABELS),
      exerciseOrder: faker.number.int({ min: 1, max: 10 }),
      setsCount: faker.number.int({ min: 2, max: 5 }),
      reps: faker.helpers.arrayElement(['8', '10', '12', '15', '8-12', '10-15', 'Al fallo']),
      restSeconds: faker.helpers.arrayElement([30, 45, 60, 90, 120]),
      weightNotes: faker.helpers.arrayElement([
        'Peso corporal',
        '20 kg',
        '30 kg',
        '40 kg',
        'Moderado',
        null,
      ]),
      observations: null,
    }
  })
  .build()
