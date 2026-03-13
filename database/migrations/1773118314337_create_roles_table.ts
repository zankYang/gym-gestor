import { BaseSchema } from '@adonisjs/lucid/schema'
import { RoleCode } from '#enums/role_enum'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 50).notNullable()
      table.string('code', 50).notNullable()
      table.text('description').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.check(
        `code in ('${RoleCode.SUPERADMIN}', '${RoleCode.ADMIN}', '${RoleCode.RECEPTIONIST}', '${RoleCode.COACH}')`
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
