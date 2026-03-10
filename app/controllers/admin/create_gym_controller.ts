import type { HttpContext } from '@adonisjs/core/http'
import { createGymValidator } from '#validators/gym'
import Gym from '#models/gym'

export default class CreateGymController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createGymValidator)

    const gym = await Gym.create(payload)

    return response.status(201).send({
      message: 'Gym creado correctamente',
      data: gym,
    })
  }
}
