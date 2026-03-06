import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Role } from '#enums/role_enum'
import { destroyUserValidator } from '#validators/user'
export default class DestroyUserController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const { id } = await destroyUserValidator.validate(params)
    const user = await User.notDeleted().where('id', id).firstOrFail()
    if (currentUser.role === Role.ADMIN && user.gymId !== currentUser.gymId) {
      return response
        .status(403)
        .send({ errors: [{ message: 'No puedes dar de baja usuarios de otro gym' }] })
    }
    if (
      user.role === Role.SUPERADMIN ||
      (user.role === Role.ADMIN && currentUser.role !== Role.SUPERADMIN) ||
      (user.gymId !== currentUser.gymId && currentUser.role !== Role.SUPERADMIN)
    ) {
      return response
        .status(403)
        .send({ errors: [{ message: 'No se puede dar de baja a este usuario' }] })
    }
    await user.softDelete()
    return response.status(200).send({
      message: 'Usuario dado de baja correctamente',
    })
  }
}
