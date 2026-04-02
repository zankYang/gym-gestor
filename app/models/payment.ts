import { PaymentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import PaymentMethod from '#models/payment_method'
import Branch from '#models/branch'
import User from '#models/user'

export default class Payment extends PaymentSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof Payment, Payment> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => ClientMembership)
  declare clientMembership: BelongsTo<typeof ClientMembership>

  @belongsTo(() => PaymentMethod)
  declare paymentMethod: BelongsTo<typeof PaymentMethod>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @belongsTo(() => User, { foreignKey: 'registeredBy' })
  declare registeredByUser: BelongsTo<typeof User>
}
