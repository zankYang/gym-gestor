import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { showUserValidator } from '#validators/user'
import { Role } from '#enums/role_enum'

export default class ShowUserController {
  async show({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const { id } = await showUserValidator.validate(params)
    const user = await User.notDeleted().where('id', id).first()
    if (!user) {
      return response.status(404).send({ errors: [{ message: 'Usuario no encontrado' }] })
    }
    if (currentUser.role === Role.ADMIN && user.gymId !== currentUser.gymId) {
      return response
        .status(403)
        .send({ errors: [{ message: 'No puedes ver usuarios de otro gym' }] })
    }
    return response.status(200).send({
      message: 'Usuario encontrado',
      data: user,
    })
  }
}
