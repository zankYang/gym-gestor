import { FileSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import User from '#models/user'
import Document from '#models/document'

export default class GymFile extends FileSchema {
  static table = 'files'

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => User, { foreignKey: 'uploadedBy' })
  declare uploadedByUser: BelongsTo<typeof User>

  @hasMany(() => Document)
  declare documents: HasMany<typeof Document>
}
