import { UserSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'

export default class User extends UserSchema {
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
}
