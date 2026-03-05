import { PaymentMethod } from '#enums/payment_method_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

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
        .integer('membership_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('memberships')
        .onDelete('CASCADE')

      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')

      table.decimal('amount', 10, 2).notNullable()
      table.timestamp('payment_date', { useTz: true }).notNullable().defaultTo(this.now())

      table.string('payment_method', 30).notNullable()
      table.string('reference', 100).nullable()
      table.text('notes').nullable()

      table
        .integer('received_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.check(`amount > 0`)
      table.check(
        `payment_method in ('${PaymentMethod.CASH}', '${PaymentMethod.TRANSFER}', '${PaymentMethod.CARD}', '${PaymentMethod.OTHER}')`
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
      table.index(['membership_id'])
      table.index(['client_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
