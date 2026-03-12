import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes'

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

      table
        .integer('trainer_id')
        .nullable()
        .references('id')
        .inTable('trainers')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.integer('capacity').notNullable()
      table.integer('duration_minutes').notNullable()
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['branch_id'])
      table.index(['trainer_id'])
      table.index(['status'])
      table.index(['name'])
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
