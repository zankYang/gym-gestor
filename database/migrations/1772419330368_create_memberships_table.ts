import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'
import { PaymentStatus } from '#enums/payment_status_enum'
export default class extends BaseSchema {
  protected tableName = 'memberships'

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

      table.integer('plan_id').unsigned().notNullable().references('id').inTable('plans')

      table.date('start_date').notNullable()
      table.date('end_date').notNullable()

      table.decimal('final_price', 10, 2).notNullable()

      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)
      table.string('payment_status', 20).notNullable().defaultTo(PaymentStatus.PENDING)

      table.text('notes').nullable()

      table
        .integer('created_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.check(`end_date >= start_date`)
      table.check(`final_price >= 0`)
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
      table.check(
        `payment_status in ('${PaymentStatus.PENDING}', '${PaymentStatus.PARTIAL}', '${PaymentStatus.PAID}')`
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
      table.index(['client_id'])
      table.index(['plan_id'])
      table.index(['status'])
      table.index(['payment_status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
