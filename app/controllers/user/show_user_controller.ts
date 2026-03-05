import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ShowUserController {
  async show({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const user = await User.notDeleted().where('id', params.id).firstOrFail()
    if (
      currentUser.role === 'admin' &&
      currentUser.gymId !== null &&
      user.gymId !== currentUser.gymId
    ) {
      return response.forbidden({ message: 'No puedes ver usuarios de otro gym' })
    }
    return response.status(200).send({
      message: 'Usuario encontrado',
      data: user,
    })
  }
}
