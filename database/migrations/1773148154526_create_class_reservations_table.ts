import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'class_reservations'

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
        .integer('class_schedule_id')
        .notNullable()
        .references('id')
        .inTable('class_schedules')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('client_id')
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.date('reservation_date').notNullable()
      table.string('status', 20).notNullable().defaultTo(Status.RESERVED)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['tenant_id'])
      table.index(['class_schedule_id'])
      table.index(['client_id'])
      table.index(['reservation_date'])
      table.index(['status'])
      table.check(
        `status in ('${Status.RESERVED}', '${Status.CANCELLED}', '${Status.ATTENDED}', '${Status.NO_SHOW}')`
      )
      table.unique(['class_schedule_id', 'client_id', 'reservation_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
