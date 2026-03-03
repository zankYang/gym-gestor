import type { HttpContext } from '@adonisjs/core/http'

export default class TestingController {
  async show({ response }: HttpContext) {
    return response.ok({
      message: 'hola mundo',
    })
  }
}
