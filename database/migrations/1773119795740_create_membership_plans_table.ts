import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'membership_plans'

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

      table.string('name', 120).notNullable()
      table.string('code', 50).notNullable()
      table.text('description').nullable()
      table.integer('duration_days').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.boolean('allows_classes').notNullable().defaultTo(false)
      table.boolean('allows_freeze').notNullable().defaultTo(false)
      table.integer('freeze_days_limit').notNullable().defaultTo(0)
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.unique(['tenant_id', 'code'])
      table.index(['tenant_id'])
      table.index(['status'])
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
