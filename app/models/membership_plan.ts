import { MembershipPlanSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import ClientMembership from '#models/client_membership'

export default class MembershipPlan extends MembershipPlanSchema {
  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @hasMany(() => ClientMembership)
  declare clientMemberships: HasMany<typeof ClientMembership>
}
