import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('gym_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('gyms')
        .onDelete('CASCADE')

      table.string('name', 100).notNullable()
      table.text('description').nullable()

      table.string('plan_type', 20).notNullable().defaultTo('membership')
      table.integer('duration_days').notNullable()
      table.decimal('price', 10, 2).notNullable()

      table.string('status', 20).notNullable().defaultTo('active')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.check(`duration_days > 0`)
      table.check(`price >= 0`)
      table.check(`status in ('active', 'inactive')`)
      table.check(`plan_type in ('membership', 'visit')`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
