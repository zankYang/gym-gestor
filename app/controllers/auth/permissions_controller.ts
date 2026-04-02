import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermissionsController {
  async store({ request, response, tenant }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password, tenant.id)
    const token = await User.accessTokens.create(user)

    return response.status(200).send({
      message: 'Conectado correctamente',
      data: {
        token: token.value!.release(),
        tenant: tenant,
      },
    })
  }
}
