import type { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/user'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

const SUPERADMIN_ROLE = 'superadmin'

export default class UpdateUserController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const user = await User.notDeleted().where('id', params.id).firstOrFail()

    if (
      currentUser.role === 'admin' &&
      currentUser.gymId !== null &&
      Number(user.gymId) !== Number(currentUser.gymId)
    ) {
      return response.forbidden({ message: 'No puedes actualizar usuarios de otro gym' })
    }

    const payload = await request.validateUsing(updateUserValidator)

    const toMerge: Partial<{
      gymId: number | null
      fullName: string
      email: string
      password: string
      role: string
      status: string
    }> = { ...payload }

    if (currentUser.role === 'admin') {
      delete toMerge.gymId
      delete toMerge.role
    } else if (toMerge.role === SUPERADMIN_ROLE && user.role !== SUPERADMIN_ROLE) {
      return response.forbidden({ message: 'No puedes promover a un usuario a superadmin' })
    }

    if (payload.email !== undefined && payload.email !== user.email) {
      const gymId = toMerge.gymId !== undefined ? toMerge.gymId : user.gymId
      let q = User.notDeleted().where('email', payload.email).whereNot('id', Number(user.id))
      if (gymId === null) {
        q = q.whereNull('gym_id')
      } else {
        q = q.where('gym_id', Number(gymId))
      }
      const existing = await q.first()
      if (existing) {
        return response.badRequest({
          message: 'Ya existe un usuario con ese email en este gym',
        })
      }
    }

    if (payload.password) {
      toMerge.password = await hash.make(payload.password)
    }
    delete (toMerge as Record<string, unknown>)['passwordConfirmation']
    user.merge(toMerge)
    await user.save()

    return response.ok({
      message: 'Usuario actualizado correctamente',
      data: user,
    })
  }
}
