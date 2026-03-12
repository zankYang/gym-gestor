import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.string('slug', 100).notNullable().unique()

      table.text('logo_url').nullable()
      table.text('banner').nullable()
      table.text('background_image_url').nullable()
      table.string('primary_color', 20).nullable()
      table.string('secondary_color', 20).nullable()

      table.string('email', 150).nullable()
      table.string('phone', 20).nullable()
      table.text('address').nullable()

      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)
      table.jsonb('config').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
