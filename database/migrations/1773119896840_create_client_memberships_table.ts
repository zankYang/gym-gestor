import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'client_memberships'

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
        .integer('membership_plan_id')
        .notNullable()
        .references('id')
        .inTable('membership_plans')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('branch_id')
        .nullable()
        .references('id')
        .inTable('branches')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.date('start_date').notNullable()
      table.date('end_date').notNullable()

      table.string('status', 20).notNullable().defaultTo(Status.PENDING)

      table.decimal('price_at_purchase', 10, 2).notNullable()
      table.decimal('discount_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('final_amount', 10, 2).notNullable()

      table.boolean('auto_renew').notNullable().defaultTo(false)
      table.integer('frozen_days_used').notNullable().defaultTo(0)

      table.text('notes').nullable()

      table
        .integer('created_by')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
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
      table.index(['membership_plan_id'])
      table.index(['branch_id'])
      table.index(['status'])
      table.index(['start_date'])
      table.index(['end_date'])
      table.check(
        `status in ('${Status.PENDING}', '${Status.ACTIVE}', '${Status.EXPIRED}', '${Status.CANCELLED}', '${Status.FROZEN}')`
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
