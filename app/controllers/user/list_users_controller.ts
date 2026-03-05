import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ListUsersController {
  async index({ auth, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    let query = User.notDeleted().orderBy('full_name', 'asc')
    if (currentUser.role === 'admin' && currentUser.gymId !== null) {
      query = query.where('gym_id', Number(currentUser.gymId))
    }
    const users = await query
    return response.status(200).send({
      message: 'Usuarios listados correctamente',
      data: users,
    })
  }
}
