import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'routines'

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
        .integer('client_id')
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('trainer_id')
        .nullable()
        .references('id')
        .inTable('trainers')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.string('name', 150).notNullable()
      table.string('goal', 150).nullable()
      table.string('status', 20).notNullable().defaultTo(Status.DRAFT)
      table.date('start_date').nullable()
      table.date('end_date').nullable()
      table.text('notes').nullable()

      table
        .integer('created_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .integer('updated_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['tenant_id'])
      table.index(['client_id'])
      table.index(['trainer_id'])
      table.index(['status'])
      table.index(['start_date'])
      table.index(['end_date'])
      table.check(
        `status in ('${Status.DRAFT}', '${Status.ACTIVE}', '${Status.COMPLETED}', '${Status.ARCHIVED}')`
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
