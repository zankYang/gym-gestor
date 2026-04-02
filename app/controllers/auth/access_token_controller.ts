import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccessTokenController {
  async store({ request, response, tenant }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password, tenant.id)

    await user.load((preloader) =>
      preloader.load('role', (roleQuery) => roleQuery.preload('permissions'))
    )

    const token = await User.accessTokens.create(user)

    return response.status(200).send({
      message: 'Conectado correctamente',
      data: {
        token: token.value!.release(),
        tenant,
        permissions: user.allPermissions,
      },
    })
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.status(200).send({ message: 'Desconectado correctamente' })
  }

  async index({ tenant, response }: HttpContext) {
    return response.status(200).send({
      message: 'Configuración del tenant obtenida correctamente',
      data: {
        tenant: tenant,
      },
    })
  }

  async filter({ consumer, response }: HttpContext) {
    return response.status(200).send({
      message: 'Permisos obtenidos correctamente',
      data: {
        permissions: consumer.role.permissions.map((permission) => permission.code),
      },
    })
  }
}
