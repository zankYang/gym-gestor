import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendance_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('tenant_id')
        .notNullable()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('attendance_id')
        .notNullable()
        .references('id')
        .inTable('attendances')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('client_id')
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.string('event_type', 30).notNullable()
      table.timestamp('event_at', { useTz: true }).notNullable().defaultTo(this.now())

      table
        .integer('registered_by')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.text('notes').nullable()
      table.jsonb('metadata').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['tenant_id'])
      table.index(['attendance_id'])
      table.index(['client_id'])
      table.index(['event_type'])
      table.index(['event_at'])
      table.check("event_type in ('checkin', 'checkout', 'denied', 'manual_adjustment', 'reopen')")
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
