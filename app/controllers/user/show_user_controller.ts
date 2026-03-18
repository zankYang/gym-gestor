import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RoleCode } from '#enums/role_enum'

export default class ShowUserController {
  async show({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    await currentUser.load((preloader) => preloader.load('role'))

    const currentRole = currentUser.role.code

    const query = User.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const user = await query.first()

    if (!user) {
      return response.status(404).send({
        errors: [{ message: 'Usuario no encontrado' }],
      })
    }

    return response.status(200).send({
      message: 'Usuario encontrado',
      data: user,
    })
  }
}
