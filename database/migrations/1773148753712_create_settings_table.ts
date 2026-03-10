import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

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

      table.string('key', 120).notNullable()
      table.jsonb('value').notNullable()
      table.text('description').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.unique(['tenant_id', 'key'])
      table.index(['tenant_id'])
      table.index(['key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
