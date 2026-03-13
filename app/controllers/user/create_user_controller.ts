import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator } from '#validators/user'
import User from '#models/user'
import Role from '#models/role'
import hash from '@adonisjs/core/services/hash'
import { Status } from '#enums/status_enum'
import { RoleCode as RoleEnum } from '#enums/role_enum'

export default class CreateUserController {
  async store({ auth, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    await currentUser.load((preloader) => preloader.load('role'))
    const currentRole = (currentUser.role as any).code as string

    const payload = await request.validateUsing(createUserValidator)

    const existingUser = await User.notDeleted()
      .where('email', payload.email)
      .where('tenant_id', payload.tenantId)
      .first()

    if (currentRole !== RoleEnum.SUPERADMIN && payload.role === RoleEnum.ADMIN) {
      return response.status(403).send({
        errors: [{ message: 'No tienes permisos para crear admins' }],
      })
    }
    if (currentRole === RoleEnum.ADMIN && payload.tenantId !== currentUser.tenantId) {
      return response
        .status(403)
        .send({ errors: [{ message: 'No tienes permisos para crear usuarios en este gym' }] })
    }
    if (existingUser) {
      return response
        .status(409)
        .send({ errors: [{ message: 'Ya existe un usuario con ese email en este gym' }] })
    }

    const roleRecord = await Role.findByOrFail('code', payload.role)
    const passwordHash = await hash.make(payload.password)

    const user = await User.create({
      tenantId: payload.tenantId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      passwordHash,
      roleId: roleRecord.id,
      status: Status.ACTIVE,
    })

    return response.status(201).send({
      message: 'Usuario creado correctamente',
      data: user,
    })
  }
}
