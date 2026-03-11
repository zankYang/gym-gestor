import { PaymentMethodSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Payment from '#models/payment'

export default class PaymentMethod extends PaymentMethodSchema {
  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>
}
