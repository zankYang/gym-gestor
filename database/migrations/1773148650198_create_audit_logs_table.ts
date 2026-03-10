import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

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

      table
        .integer('user_id')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.string('entity_type', 50).notNullable()
      table.integer('entity_id').notNullable()
      table.string('action', 30).notNullable()

      table.jsonb('old_values').nullable()
      table.jsonb('new_values').nullable()

      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['tenant_id'])
      table.index(['user_id'])
      table.index(['entity_type', 'entity_id'])
      table.index(['action'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
