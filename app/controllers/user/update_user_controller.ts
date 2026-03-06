import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'
import { Role } from '#enums/role_enum'
import hash from '@adonisjs/core/services/hash'

export default class UpdateUserController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const payload = await request.validateUsing(updateUserValidator)

    if (payload.password) {
      payload.password = await hash.make(payload.password)
    }

    let query = User.notDeleted().where('id', params.id)

    if (currentUser.role !== Role.SUPERADMIN) {
      query = query.where('gym_id', currentUser.gymId!)
    }

    const user = await query.firstOrFail()

    user.merge(payload)
    await user.save()

    return response.status(200).send({
      message: 'Usuario actualizado correctamente',
      data: user,
    })
  }
}
