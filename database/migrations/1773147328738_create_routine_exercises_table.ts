import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'routine_exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('routine_id')
        .notNullable()
        .references('id')
        .inTable('routines')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('exercise_catalog_id')
        .notNullable()
        .references('id')
        .inTable('exercise_catalog')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.string('day_label', 50).nullable()
      table.integer('exercise_order').notNullable()
      table.integer('sets_count').nullable()
      table.string('reps', 50).nullable()
      table.integer('rest_seconds').nullable()
      table.text('weight_notes').nullable()
      table.text('observations').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['routine_id'])
      table.index(['exercise_catalog_id'])
      table.index(['day_label'])
      table.index(['exercise_order'])
      table.unique(['routine_id', 'day_label', 'exercise_order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
