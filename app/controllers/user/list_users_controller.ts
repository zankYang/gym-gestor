import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

export default class ListUsersController {
  async index({ response, serialize }: HttpContext) {
    const users = await User.notDeleted().orderBy('full_name', 'asc')
    return response.status(200).send({
      message: 'Usuarios listados correctamente',
      data: serialize(users.map((u) => UserTransformer.transform(u))),
    })
  }
}
