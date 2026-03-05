import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class DestroyUserController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const user = await User.notDeleted().where('id', params.id).firstOrFail()
    if (
      currentUser.role === 'admin' &&
      currentUser.gymId !== null &&
      user.gymId !== currentUser.gymId
    ) {
      return response.forbidden({ message: 'No puedes dar de baja usuarios de otro gym' })
    }
    if (user.role === 'superadmin') {
      return response.forbidden({ message: 'No se puede dar de baja a un superadmin' })
    }
    await user.softDelete()
    return response.status(200).send({
      message: 'Usuario dado de baja correctamente',
    })
  }
}
