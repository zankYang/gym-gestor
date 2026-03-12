import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Role } from '#enums/role_enum'
import { destroyUserValidator } from '#validators/user'

export default class DestroyUserController {
  async destroy({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    await currentUser.load((preloader) => preloader.load('role'))
    const currentRole = (currentUser.role as any).code as string

    const { id } = await destroyUserValidator.validate(params)
    const user = await User.notDeleted().where('id', id).firstOrFail()
    await user.load((preloader) => preloader.load('role'))
    const userRole = (user.role as any).code as string

    if (currentRole === Role.ADMIN && user.tenantId !== currentUser.tenantId) {
      return response
        .status(403)
        .send({ errors: [{ message: 'No puedes dar de baja usuarios de otro gym' }] })
    }
    if (
      userRole === Role.SUPERADMIN ||
      (userRole === Role.ADMIN && currentRole !== Role.SUPERADMIN) ||
      (user.tenantId !== currentUser.tenantId && currentRole !== Role.SUPERADMIN)
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
