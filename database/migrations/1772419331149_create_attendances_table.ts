import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('gym_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('gyms')
        .onDelete('CASCADE')

      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')

      table
        .integer('membership_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('memberships')
        .onDelete('SET NULL')

      table.timestamp('check_in', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('check_out', { useTz: true }).nullable()

      table.boolean('access_granted').notNullable().defaultTo(true)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
      table.index(['client_id'])
      table.index(['check_in'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
