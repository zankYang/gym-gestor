import { Status } from '#enums/status_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

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

      table.string('recipient_type', 20).notNullable()
      table.integer('recipient_id').notNullable()

      table.string('title', 150).notNullable()
      table.text('message').notNullable()

      table.string('channel', 20).notNullable()
      table.string('status', 20).notNullable().defaultTo(Status.PENDING)

      table.timestamp('sent_at', { useTz: true }).nullable()
      table.timestamp('read_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['tenant_id'])
      table.index(['recipient_type', 'recipient_id'])
      table.index(['channel'])
      table.index(['status'])
      table.index(['read_at'])
      table.check(`status in ('${Status.PENDING}', '${Status.SENT}', '${Status.FAILED}')`)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
