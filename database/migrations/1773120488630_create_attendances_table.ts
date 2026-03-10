import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

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
        .integer('client_membership_id')
        .nullable()
        .references('id')
        .inTable('client_memberships')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .integer('branch_id')
        .nullable()
        .references('id')
        .inTable('branches')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.date('attendance_date').notNullable()
      table.timestamp('check_in_at', { useTz: true }).notNullable()
      table.timestamp('check_out_at', { useTz: true }).nullable()
      table.string('status', 20).notNullable().defaultTo(Status.CHECKED_IN)

      table
        .integer('registered_by')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['tenant_id'])
      table.index(['client_id'])
      table.index(['client_membership_id'])
      table.index(['branch_id'])
      table.index(['attendance_date'])
      table.index(['status'])
      table.check(`status in ('${Status.CHECKED_IN}', '${Status.CHECKED_OUT}', '${Status.DENIED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
