import type { HttpContext } from '@adonisjs/core/http'
import { updateTenantValidator } from '#validators/tenant'
import Tenant from '#models/tenant'
import { RoleCode } from '#enums/role_enum'

export default class UpdateTenantController {
  async update({ consumer, params, request, response }: HttpContext) {
    if (consumer.role.code !== RoleCode.SUPERADMIN) {
      return response.status(403).send({
        errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
      })
    }

    const tenant = await Tenant.notDeleted().where('id', params.id).firstOrFail()
    const payload = await request.validateUsing(updateTenantValidator)

    if (payload.slug !== undefined && payload.slug !== tenant.slug) {
      const existing = await Tenant.notDeleted()
        .where('slug', payload.slug)
        .whereNot('id', tenant.id)
        .first()
      if (existing) {
        return response.badRequest({
          errors: [{ message: 'Ya existe otro tenant con ese slug' }],
        })
      }
    }

    tenant.merge(payload)
    await tenant.save()

    return response.ok({
      message: 'Tenant actualizado correctamente',
      data: tenant,
    })
  }
}
