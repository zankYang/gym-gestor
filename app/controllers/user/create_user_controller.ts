import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator } from '#validators/user'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import hash from '@adonisjs/core/services/hash'

export default class CreateUserController {
  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const gymId = payload.gymId ?? null
    let q = User.notDeleted().where('email', payload.email)
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

    const hashedPassword = await hash.make(payload.password)
    const user = await User.create({
      gymId: payload.gymId ?? null,
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
      status: payload.status ?? 'active',
    })

    return response.status(201).send({
      message: 'Usuario creado correctamente',
      data: serialize(UserTransformer.transform(user)),
    })
  }
}
