import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 120).notNullable()
      table.string('code', 60).notNullable().unique()
      table.text('description').nullable()

      table.boolean('requires_signature').notNullable().defaultTo(false)
      table.boolean('requires_expiration').notNullable().defaultTo(false)
      table.boolean('is_mandatory_for_client').notNullable().defaultTo(false)
      table.boolean('is_mandatory_for_trainer').notNullable().defaultTo(false)

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
