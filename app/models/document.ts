import { DateTime } from 'luxon'
import { DocumentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Tenant from '#models/tenant'
import DocumentType from '#models/document_type'
import GymFile from '#models/file'
import User from '#models/user'

export default class Document extends DocumentSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Document, Document> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => DocumentType)
  declare documentType: BelongsTo<typeof DocumentType>

  @belongsTo(() => GymFile, { foreignKey: 'fileId' })
  declare file: BelongsTo<typeof GymFile>

  @belongsTo(() => User, { foreignKey: 'uploadedBy' })
  declare uploadedByUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'approvedBy' })
  declare approvedByUser: BelongsTo<typeof User>
}
