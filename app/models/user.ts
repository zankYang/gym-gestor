import { DateTime } from 'luxon'
import { UserSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Gym from '#models/gym'

export default class User extends UserSchema {
  /**
   * Query solo usuarios no borrados (deleted_at null).
   */
  static notDeleted(): ModelQueryBuilderContract<typeof User, User> {
    return this.query().whereNull('deleted_at')
  }

  /**
   * Borrado lógico: marca deleted_at y guarda.
   */
  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  static verifyCredentials = async (email: string, password: string) => {
    const user = await User.query().where('email', email).first()
    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }
    return user
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @belongsTo(() => Gym)
  declare gym: BelongsTo<typeof Gym>
}
