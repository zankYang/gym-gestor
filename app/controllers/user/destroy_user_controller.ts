import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class DestroyUserController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const user = await User.notDeleted()
      .where('id', params.id)
      .where('tenant_id', currentUser.tenantId)
      .first()
    if (!user) {
      return response.status(404).send({ errors: [{ message: 'Usuario no encontrado' }] })
    }

    await user.softDelete()
    return response.status(200).send({
      message: 'Usuario dado de baja correctamente',
    })
  }
}
