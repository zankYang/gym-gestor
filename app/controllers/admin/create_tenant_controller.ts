import type { HttpContext } from '@adonisjs/core/http'
import { createTenantValidator } from '#validators/tenant'
import Tenant from '#models/tenant'
import { RoleCode } from '#enums/role_enum'

export default class CreateTenantController {
  async store({ consumer, request, response }: HttpContext) {
    if (consumer.role.code !== RoleCode.SUPERADMIN) {
      return response.status(403).send({
        errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
      })
    }

    const payload = await request.validateUsing(createTenantValidator)

    const tenant = await Tenant.create(payload)

    return response.status(201).send({
      message: 'Tenant creado correctamente',
      data: tenant,
    })
  }
}
