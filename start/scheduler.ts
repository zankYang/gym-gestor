import scheduler from 'adonisjs-scheduler/services/main'

/**
 * Corre cada día a medianoche.
 * withoutOverlapping evita que se pise con una ejecución previa.
 */
// scheduler.command('memberships:update-status').dailyAt('00:00').withoutOverlapping()

/**
 * Opcional: una tarea más frecuente para pruebas/local.
 * Déjala comentada cuando ya no la necesites.
 */
// scheduler
//   .command('memberships:update-status')
//   .everyMinute()
//   .withoutOverlapping()

/**
 * También puedes agrupar por tag para correr solo ciertas tareas.
 */
// scheduler.command('memberships:update-status').tag('memberships').hourly().withoutOverlapping()

scheduler.command('memberships:update-status').everyMinute().withoutOverlapping()
