import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'payment_methods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 100).notNullable()
      table.string('code', 50).notNullable().unique()
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
