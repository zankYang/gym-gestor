import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('gym_id')
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

      table.string('status', 20).notNullable().defaultTo('active')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.check(`gender in ('male', 'female', 'other')`)
      table.check(`status in ('active', 'inactive')`)
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
