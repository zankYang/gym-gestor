import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'class_schedules'

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
        .integer('class_id')
        .notNullable()
        .references('id')
        .inTable('classes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.integer('day_of_week').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.string('room_name', 120).nullable()
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['tenant_id'])
      table.index(['class_id'])
      table.index(['day_of_week'])
      table.index(['status'])
      table.unique(['class_id', 'day_of_week', 'start_time'])
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
