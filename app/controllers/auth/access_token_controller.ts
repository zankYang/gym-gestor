import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AccessTokenController {
  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.query().where('email', email).first()
    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    const token = await User.accessTokens.create(user)

    return serialize({
      user,
      token: token.value!.release(),
    })
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('api').invalidateToken()
    return {
      message: 'Logged out successfully',
    }
  }
}
