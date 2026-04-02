import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator } from '#validators/user'
import User from '#models/user'
import Role from '#models/role'
import { Status } from '#enums/status_enum'
import { RoleCode } from '#enums/role_enum'

export default class CreateUserController {
  async store({ consumer, request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const targetTenantId =
      consumer.role.code === RoleCode.SUPERADMIN ? payload.tenantId : consumer.tenantId

    const existingUser = await User.notDeleted()
      .where('email', payload.email)
      .where('tenant_id', targetTenantId!)
      .first()

    if (existingUser) {
      return response.status(409).send({
        errors: [{ message: 'Ya existe un usuario con ese email en este gym' }],
      })
    }

    const roleRecord = await Role.findByOrFail('code', payload.role)
    const user = await User.create({
      tenantId: targetTenantId,
      avatarUrl: payload.avatarUrl,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      passwordHash: payload.password,
      roleId: roleRecord.id,
      status: Status.ACTIVE,
    })

    return response.status(201).send({
      message: 'Usuario creado correctamente',
      data: user,
    })
  }
}
