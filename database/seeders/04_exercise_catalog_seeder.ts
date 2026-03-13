import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ExerciseCatalog from '#models/exercise_catalog'
import { Status } from '#enums/status_enum'

export default class ExerciseCatalogSeeder extends BaseSeeder {
  async run() {
    const exercises = [
      // Pecho
      {
        name: 'Press de banca plano',
        code: 'PRESS_BANCA_PLANO',
        muscleGroup: 'Pecho',
        equipment: 'Barra',
        description: 'Press de banca con barra en banco plano',
      },
      {
        name: 'Press de banca inclinado',
        code: 'PRESS_BANCA_INCLINADO',
        muscleGroup: 'Pecho',
        equipment: 'Mancuernas',
        description: 'Press en banco inclinado con mancuernas',
      },
      {
        name: 'Aperturas con mancuernas',
        code: 'APERTURAS_MANCUERNAS',
        muscleGroup: 'Pecho',
        equipment: 'Mancuernas',
        description: 'Aperturas en banco plano',
      },
      {
        name: 'Flexiones',
        code: 'FLEXIONES',
        muscleGroup: 'Pecho',
        equipment: null,
        description: 'Flexiones de brazos con peso corporal',
      },

      // Espalda
      {
        name: 'Dominadas',
        code: 'DOMINADAS',
        muscleGroup: 'Espalda',
        equipment: 'Barra fija',
        description: 'Dominadas en barra fija',
      },
      {
        name: 'Remo con barra',
        code: 'REMO_BARRA',
        muscleGroup: 'Espalda',
        equipment: 'Barra',
        description: 'Remo inclinado con barra',
      },
      {
        name: 'Jalón al pecho',
        code: 'JALON_PECHO',
        muscleGroup: 'Espalda',
        equipment: 'Polea',
        description: 'Jalón al pecho en polea alta',
      },
      {
        name: 'Remo en polea baja',
        code: 'REMO_POLEA_BAJA',
        muscleGroup: 'Espalda',
        equipment: 'Polea',
        description: 'Remo sentado en polea baja',
      },

      // Piernas
      {
        name: 'Sentadilla',
        code: 'SENTADILLA',
        muscleGroup: 'Piernas',
        equipment: 'Barra',
        description: 'Sentadilla con barra en espalda',
      },
      {
        name: 'Prensa de piernas',
        code: 'PRENSA_PIERNAS',
        muscleGroup: 'Piernas',
        equipment: 'Máquina',
        description: 'Prensa de piernas en máquina',
      },
      {
        name: 'Extensión de cuádriceps',
        code: 'EXTENSION_CUADRICEPS',
        muscleGroup: 'Piernas',
        equipment: 'Máquina',
        description: 'Extensión de cuádriceps en máquina',
      },
      {
        name: 'Curl femoral',
        code: 'CURL_FEMORAL',
        muscleGroup: 'Piernas',
        equipment: 'Máquina',
        description: 'Curl de isquiotibiales en máquina',
      },
      {
        name: 'Peso muerto',
        code: 'PESO_MUERTO',
        muscleGroup: 'Piernas',
        equipment: 'Barra',
        description: 'Peso muerto convencional con barra',
      },
      {
        name: 'Zancadas',
        code: 'ZANCADAS',
        muscleGroup: 'Piernas',
        equipment: 'Mancuernas',
        description: 'Zancadas con mancuernas',
      },

      // Hombros
      {
        name: 'Press militar',
        code: 'PRESS_MILITAR',
        muscleGroup: 'Hombros',
        equipment: 'Barra',
        description: 'Press de hombros con barra',
      },
      {
        name: 'Elevaciones laterales',
        code: 'ELEVACIONES_LATERALES',
        muscleGroup: 'Hombros',
        equipment: 'Mancuernas',
        description: 'Elevaciones laterales con mancuernas',
      },
      {
        name: 'Elevaciones frontales',
        code: 'ELEVACIONES_FRONTALES',
        muscleGroup: 'Hombros',
        equipment: 'Mancuernas',
        description: 'Elevaciones frontales con mancuernas',
      },

      // Bíceps
      {
        name: 'Curl de bíceps con barra',
        code: 'CURL_BICEPS_BARRA',
        muscleGroup: 'Bíceps',
        equipment: 'Barra',
        description: 'Curl de bíceps con barra recta',
      },
      {
        name: 'Curl de bíceps martillo',
        code: 'CURL_MARTILLO',
        muscleGroup: 'Bíceps',
        equipment: 'Mancuernas',
        description: 'Curl martillo con mancuernas',
      },

      // Tríceps
      {
        name: 'Fondos en paralelas',
        code: 'FONDOS_PARALELAS',
        muscleGroup: 'Tríceps',
        equipment: 'Paralelas',
        description: 'Fondos en paralelas con peso corporal',
      },
      {
        name: 'Extensión de tríceps en polea',
        code: 'EXTENSION_TRICEPS_POLEA',
        muscleGroup: 'Tríceps',
        equipment: 'Polea',
        description: 'Press down en polea alta',
      },

      // Abdomen
      {
        name: 'Crunch abdominal',
        code: 'CRUNCH_ABDOMINAL',
        muscleGroup: 'Abdomen',
        equipment: null,
        description: 'Crunch clásico en el suelo',
      },
      {
        name: 'Plancha',
        code: 'PLANCHA',
        muscleGroup: 'Abdomen',
        equipment: null,
        description: 'Plancha isométrica',
      },
      {
        name: 'Elevación de piernas',
        code: 'ELEVACION_PIERNAS',
        muscleGroup: 'Abdomen',
        equipment: null,
        description: 'Elevación de piernas colgado en barra',
      },

      // Cardio
      {
        name: 'Cinta de correr',
        code: 'CINTA_CORRER',
        muscleGroup: 'Cardio',
        equipment: 'Cinta',
        description: 'Carrera o caminata en cinta',
      },
      {
        name: 'Bicicleta estática',
        code: 'BICICLETA_ESTATICA',
        muscleGroup: 'Cardio',
        equipment: 'Bicicleta',
        description: 'Pedaleo en bicicleta estática',
      },
      {
        name: 'Elíptica',
        code: 'ELIPTICA',
        muscleGroup: 'Cardio',
        equipment: 'Elíptica',
        description: 'Ejercicio cardiovascular en elíptica',
      },
    ]

    for (const exercise of exercises) {
      await ExerciseCatalog.firstOrCreate(
        { code: exercise.code },
        { ...exercise, status: Status.ACTIVE }
      )
    }
  }
}
