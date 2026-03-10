import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trainers'

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
        .integer('user_id')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .integer('branch_id')
        .nullable()
        .references('id')
        .inTable('branches')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 150).nullable()
      table.string('phone', 30).nullable()
      table.string('specialty', 150).nullable()
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['tenant_id'])
      table.index(['user_id'])
      table.index(['branch_id'])
      table.index(['status'])
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
