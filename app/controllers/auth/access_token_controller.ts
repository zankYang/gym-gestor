import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AccessTokenController {
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.query().where('email', email).first()
    if (!user) {
      return response.status(401).send({
        message: 'Usuario no encontrado',
      })
    }
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return response.status(401).send({
        message: 'Contraseña incorrecta',
      })
    }

    const token = await User.accessTokens.create(user)

    return response.status(200).send({
      message: 'Conectado correctamente',
      data: {
        token: token.value!.release(),
      },
    })
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.status(200).send({ message: 'Desconectado correctamente' })
  }
}
