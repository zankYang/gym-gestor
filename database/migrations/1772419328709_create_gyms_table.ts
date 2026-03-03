import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gyms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.string('slug', 100).notNullable().unique()

      table.text('logo_url').nullable()
      table.string('primary_color', 20).nullable()
      table.string('secondary_color', 20).nullable()
      table.string('accent_color', 20).nullable()

      table.string('email', 150).nullable()
      table.string('phone', 20).nullable()
      table.text('address').nullable()

      table.string('status', 20).notNullable().defaultTo('active')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.check(`status in ('active', 'inactive', 'suspended')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
