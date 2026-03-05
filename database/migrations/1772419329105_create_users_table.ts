import { BaseSchema } from '@adonisjs/lucid/schema'
import { Role } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('gym_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('gyms')
        .onDelete('CASCADE')

      table.string('full_name', 150).notNullable()
      table.string('email', 150).notNullable()
      table.string('password', 255).notNullable()

      table.string('role', 30).notNullable()
      table.string('status', 20).notNullable().defaultTo(Status.ACTIVE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.unique(['gym_id', 'email'])

      table.check(
        `role in ('${Role.SUPERADMIN}', '${Role.ADMIN}', '${Role.RECEPTIONIST}', '${Role.TRAINER}')`
      )
      table.check(`status in ('${Status.ACTIVE}', '${Status.INACTIVE}', '${Status.SUSPENDED}')`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['gym_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
