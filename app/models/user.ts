import { DateTime } from 'luxon'
import { UserSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { beforeSave, belongsTo, column, computed } from '@adonisjs/lucid/orm'
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

  static verifyCredentials = async (email: string, password: string, tenantId: number) => {
    const user = await User.notDeleted().where('tenant_id', tenantId).where('email', email).first()
    if (!user) {
      throw new AuthException()
    }
    const isPasswordValid = await hash.verify(user.passwordHash, password)
    if (!isPasswordValid) {
      throw new AuthException()
    }
    return user
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.passwordHash) {
      user.passwordHash = await hash.make(user.passwordHash)
    }
  }

  @computed()
  public get allPermissions(): string[] {
    return this.role?.permissions.map((p) => p.code) || []
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ serializeAs: null })
  declare passwordHash: string

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>
}
