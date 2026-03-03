import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class DestroyUserController {
  async destroy({ params, response }: HttpContext) {
    const user = await User.notDeleted().where('id', params.id).firstOrFail()
    await user.softDelete()
    return response.status(200).send({
      message: 'Usuario dado de baja correctamente',
    })
  }
}
