import { DateTime } from 'luxon'
import { UserSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Tenant from '#models/tenant'
import Role from '#models/role'
import Branch from '#models/branch'
import { AuthException } from '#exceptions/auth_exceptions'

export default class User extends UserSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof User, User> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  static verifyCredentials = async (email: string, password: string) => {
    const user = await User.query().where('email', email).first()
    if (!user) {
      throw new AuthException()
    }
    const isPasswordValid = await hash.verify(user.passwordHash, password)
    if (!isPasswordValid) {
      throw new AuthException()
    }
    return user
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>
}
