import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

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

      table.string('full_name', 150).notNullable()
      table.string('email', 150).notNullable()
      table.string('password', 255).notNullable()

      table.string('role', 30).notNullable()
      table.string('status', 20).notNullable().defaultTo('active')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.unique(['gym_id', 'email'])

      table.check(`role in ('admin', 'receptionist', 'trainer')`)
      table.check(`status in ('active', 'inactive')`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
