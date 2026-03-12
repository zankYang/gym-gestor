import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { updateUserValidator } from '#validators/user'
import { RoleCode } from '#enums/role_enum'
import hash from '@adonisjs/core/services/hash'

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

    const user = await query.firstOrFail()

    const updateData: Record<string, any> = {}

    if (payload.firstName !== undefined) updateData.firstName = payload.firstName
    if (payload.lastName !== undefined) updateData.lastName = payload.lastName
    if (payload.email !== undefined) updateData.email = payload.email
    if (payload.status !== undefined) updateData.status = payload.status
    if (payload.password) updateData.passwordHash = await hash.make(payload.password)
    if (payload.role) {
      const roleRecord = await Role.findByOrFail('code', payload.role)
      updateData.roleId = roleRecord.id
    }

    user.merge(updateData)
    await user.save()

    return response.status(200).send({
      message: 'Usuario actualizado correctamente',
      data: user,
    })
  }
}
