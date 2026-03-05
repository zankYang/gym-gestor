import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'
import { PlanType } from '#enums/plan_type_enum'
export default class extends BaseSchema {
  protected tableName = 'plans'

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

      table.string('name', 100).notNullable()
      table.text('description').nullable()

      table.string('plan_type', 20).notNullable().defaultTo(PlanType.MEMBERSHIP)
      table.integer('duration_days').notNullable()
      table.decimal('price', 10, 2).notNullable()

      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.check(`duration_days > 0`)
      table.check(`price >= 0`)
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
      table.check(`plan_type in ('${PlanType.MEMBERSHIP}', '${PlanType.VISIT}')`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
