import type { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/user'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import hash from '@adonisjs/core/services/hash'

export default class UpdateUserController {
  async update({ params, request, response, serialize }: HttpContext) {
    const user = await User.notDeleted().where('id', params.id).firstOrFail()
    const payload = await request.validateUsing(updateUserValidator)

    if (payload.email !== undefined && payload.email !== user.email) {
      const gymId = payload.gymId !== undefined ? payload.gymId : user.gymId
      let q = User.notDeleted().where('email', payload.email).whereNot('id', user.id)
      if (gymId === null) {
        q = q.whereNull('gym_id')
      } else {
        q = q.where('gym_id', gymId)
      }
      const existing = await q.first()
      if (existing) {
        return response.badRequest({
          message: 'Ya existe un usuario con ese email en este gym',
        })
      }
    }

    const toMerge: Partial<{
      gymId: number | null
      fullName: string
      email: string
      password: string
      role: string
      status: string
    }> = { ...payload }
    if (payload.password) {
      toMerge.password = await hash.make(payload.password)
    }
    delete (toMerge as Record<string, unknown>)['passwordConfirmation']
    user.merge(toMerge)
    await user.save()

    return response.ok({
      message: 'Usuario actualizado correctamente',
      data: serialize(UserTransformer.transform(user)),
    })
  }
}
