import type { HttpContext } from '@adonisjs/core/http'
import { createGymValidator } from '#validators/gym'
import Tenant from '#models/tenant'

export default class CreateGymController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createGymValidator)

    const tenant = await Tenant.create(payload)

    return response.status(201).send({
      message: 'Gym creado correctamente',
      data: tenant,
    })
  }
}
