import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'
import { RoleCode } from '#enums/role_enum'

export default class UpdateUserController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    await currentUser.load((preloader) => preloader.load('role'))
    const currentRole = (currentUser.role as any).code as string

    const payload = await request.validateUsing(updateUserValidator)

    let query = User.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', currentUser.tenantId)
    }

    const user = await query.first()
    if (!user) {
      return response.status(404).send({
        errors: [{ message: 'Usuario no encontrado' }],
      })
    }

    user.merge(payload)
    await user.save()

    return response.status(200).send({
      message: 'Usuario actualizado correctamente',
      data: user,
    })
  }
}
