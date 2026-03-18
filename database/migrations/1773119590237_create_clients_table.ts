import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'clients'

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
        .integer('branch_id')
        .nullable()
        .references('id')
        .inTable('branches')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('gender', 30).nullable()
      table.string('email', 150).nullable()
      table.string('phone', 30).notNullable()
      table.date('birth_date').nullable()

      table.decimal('height', 10, 2).nullable()
      table.decimal('weight', 10, 2).nullable()
      table.text('medical_notes').nullable()

      table.string('emergency_contact_name', 150).nullable()
      table.string('emergency_contact_phone', 30).nullable()
      table.text('notes').nullable()
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)
      table.timestamp('joined_at', { useTz: true }).notNullable().defaultTo(this.now())

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
      table.index(['branch_id'])
      table.index(['status'])
      table.index(['phone'])
      table.index(['email'])
      table.index(['joined_at'])
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
