import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

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
        .integer('payment_method_id')
        .notNullable()
        .references('id')
        .inTable('payment_methods')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('branch_id')
        .nullable()
        .references('id')
        .inTable('branches')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.decimal('amount', 10, 2).notNullable()
      table.timestamp('payment_date', { useTz: true }).notNullable().defaultTo(this.now())
      table.string('reference', 150).nullable()
      table.string('concept', 50).notNullable()
      table.string('status', 20).notNullable().defaultTo(Status.PAID)
      table.text('notes').nullable()

      table
        .integer('registered_by')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['tenant_id'])
      table.index(['client_id'])
      table.index(['client_membership_id'])
      table.index(['payment_method_id'])
      table.index(['branch_id'])
      table.index(['status'])
      table.index(['concept'])
      table.index(['payment_date'])
      table.check(
        `status in ('${Status.PAID}', '${Status.PENDING}', '${Status.CANCELLED}', '${Status.REFUNDED}')`
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
