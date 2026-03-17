import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ShowUserController {
  async show({ params, response }: HttpContext) {
    const user = await User.notDeleted().where('id', params.id).first()
    if (!user) {
      return response.status(404).send({ errors: [{ message: 'Usuario no encontrado' }] })
    }

    return response.status(200).send({
      message: 'Usuario encontrado',
      data: user,
    })
  }
}
