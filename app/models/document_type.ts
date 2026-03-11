import { DocumentTypeSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Document from '#models/document'

export default class DocumentType extends DocumentTypeSchema {
  @hasMany(() => Document)
  declare documents: HasMany<typeof Document>
}
