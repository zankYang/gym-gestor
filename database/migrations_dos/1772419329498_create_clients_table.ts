import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'clients'

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

      table.string('full_name', 150).notNullable()

      table.string('phone', 20).nullable()
      table.string('email', 150).nullable()
      table.date('birth_date').nullable()
      table.string('gender', 20).nullable()

      table.text('address').nullable()
      table.string('emergency_contact_name', 150).nullable()
      table.string('emergency_contact_phone', 20).nullable()
      table.text('notes').nullable()

      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.check(`gender in ('Hombre', 'Mujer', 'Otro')`)
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
