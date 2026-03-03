import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

export default class ShowUserController {
  async show({ params, response, serialize }: HttpContext) {
    const user = await User.notDeleted().where('id', params.id).firstOrFail()
    return response.status(200).send({
      message: 'Usuario encontrado',
      data: serialize(UserTransformer.transform(user)),
    })
  }
}
