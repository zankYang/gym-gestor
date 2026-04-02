import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { updateUserValidator } from '#validators/user'
import { RoleCode } from '#enums/role_enum'

export default class UpdateUserController {
  async update({ consumer, params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const { role: roleCode, password, ...rest } = payload

    let query = User.notDeleted().where('id', params.id)

    if (consumer.role.code !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', consumer.tenantId)
    }

    const user = await query.first()
    if (!user) {
      return response.status(404).send({
        errors: [{ message: 'Usuario no encontrado' }],
      })
    }

    user.merge(rest)
    if (password !== undefined) {
      user.passwordHash = password
    }
    if (roleCode !== undefined) {
      const roleRecord = await Role.findByOrFail('code', roleCode)
      user.roleId = roleRecord.id
    }

    await user.save()

    return response.status(200).send({
      message: 'Usuario actualizado correctamente',
      data: user,
    })
  }
}
