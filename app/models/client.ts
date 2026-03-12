import { ClientSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import Branch from '#models/branch'
import User from '#models/user'
import ClientMembership from '#models/client_membership'
import Attendance from '#models/attendance'
import Routine from '#models/routine'
import ClassReservation from '#models/class_reservation'

export default class Client extends ClientSchema {
  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare createdByUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'updatedBy' })
  declare updatedByUser: BelongsTo<typeof User>

  @hasMany(() => ClientMembership)
  declare clientMemberships: HasMany<typeof ClientMembership>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  @hasMany(() => Routine)
  declare routines: HasMany<typeof Routine>

  @hasMany(() => ClassReservation)
  declare classReservations: HasMany<typeof ClassReservation>
}
