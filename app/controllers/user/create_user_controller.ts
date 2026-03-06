import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator } from '#validators/user'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { Status } from '#enums/status_enum'
import { Role } from '#enums/role_enum'

export default class CreateUserController {
  async store({ auth, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const payload = await request.validateUsing(createUserValidator)
    const existingUser = await User.notDeleted()
      .where('email', payload.email)
      .where('gym_id', payload.gymId)
      .first()

    if (currentUser.role !== Role.SUPERADMIN && payload.role === Role.ADMIN) {
      return response.status(403).send({
        errors: [{ message: 'No tienes permisos para crear admins' }],
      })
    }
    if (currentUser.role === Role.ADMIN && payload.gymId !== currentUser.gymId) {
      return response
        .status(403)
        .send({ errors: [{ message: 'No tienes permisos para crear usuarios en este gym' }] })
    }
    if (existingUser) {
      return response
        .status(409)
        .send({ errors: [{ message: 'Ya existe un usuario con ese email en este gym' }] })
    }

    const hashedPassword = await hash.make(payload.password)

    const user = await User.create({
      gymId: payload.gymId,
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
      status: Status.ACTIVE,
    })

    return response.status(201).send({
      message: 'Usuario creado correctamente',
      data: user,
    })
  }
}
