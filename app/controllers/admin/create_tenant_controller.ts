import type { HttpContext } from '@adonisjs/core/http'
import { createTenantValidator } from '#validators/tenant'
import Tenant from '#models/tenant'

export default class CreateTenantController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTenantValidator)

    const tenant = await Tenant.create(payload)

    return response.status(201).send({
      message: 'Tenant creado correctamente',
      data: tenant,
    })
  }
}
