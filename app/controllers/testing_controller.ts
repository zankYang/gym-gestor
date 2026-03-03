import { GymFactory } from '#database/factories/gym_factory'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class TestingController {
  async show({ response }: HttpContext) {
    const gym = await GymFactory.create()
    logger.info('hola')
    return response.ok(gym)
  }
}
