import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

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

      table.string('storage_provider', 30).notNullable()
      table.string('bucket_name', 150).nullable()
      table.text('object_key').notNullable()
      table.string('original_name', 255).notNullable()
      table.string('stored_name', 255).notNullable()
      table.string('mime_type', 150).notNullable()
      table.string('extension', 20).notNullable()
      table.bigInteger('size_bytes').notNullable()
      table.string('checksum', 255).nullable()
      table.string('visibility', 20).notNullable().defaultTo('private')

      table
        .integer('uploaded_by')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['tenant_id'])
      table.index(['storage_provider'])
      table.index(['visibility'])
      table.index(['uploaded_by'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
