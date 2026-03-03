import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import db from '@adonisjs/lucid/services/db'

export default class NewAccountController {
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const gym = await db.connection().from('gyms').select('id').first()
    if (!gym) {
      throw new Error('No gym available for registration')
    }

    const user = await User.create({
      gymId: gym.id,
      fullName,
      email,
      password,
      role: 'receptionist',
      status: 'active',
    })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
