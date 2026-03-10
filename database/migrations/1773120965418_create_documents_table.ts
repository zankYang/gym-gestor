import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'documents'

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
        .integer('document_type_id')
        .notNullable()
        .references('id')
        .inTable('document_types')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('file_id')
        .notNullable()
        .references('id')
        .inTable('files')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.string('entity_type', 30).notNullable()
      table.integer('entity_id').notNullable()

      table.string('title', 200).notNullable()
      table.text('description').nullable()

      table.string('status', 20).notNullable().defaultTo(Status.PENDING_REVIEW)
      table.integer('version').notNullable().defaultTo(1)

      table.timestamp('issued_at', { useTz: true }).nullable()
      table.timestamp('expires_at', { useTz: true }).nullable()

      table.boolean('is_signed').notNullable().defaultTo(false)
      table.timestamp('signed_at', { useTz: true }).nullable()

      table
        .integer('uploaded_by')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('approved_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.timestamp('approved_at', { useTz: true }).nullable()
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['tenant_id'])
      table.index(['document_type_id'])
      table.index(['file_id'])
      table.index(['entity_type', 'entity_id'])
      table.index(['status'])
      table.index(['expires_at'])
      table.check(
        `status in ('${Status.ACTIVE}', '${Status.PENDING_REVIEW}', '${Status.APPROVED}', '${Status.REJECTED}', '${Status.EXPIRED}', '${Status.ARCHIVED}')`
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
