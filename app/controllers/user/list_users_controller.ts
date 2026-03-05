import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Role } from '#enums/role_enum'

export default class ListUsersController {
  async index({ auth, response, request }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const page = Math.max(1, Number(request.input('page', 1)))
    const perPage = Math.min(100, Math.max(1, Number(request.input('perPage', 10))))
    const q = (request.input('q') ?? '').toString().trim()
    const role = request.input('role') as string | undefined
    const status = request.input('status') as string | undefined
    const sortBy = (request.input('sortBy') ?? 'created_at').toString()
    let gymIdFilter: number | undefined

    if (currentUser.role === Role.SUPERADMIN) {
      gymIdFilter = request.input('gymId') as number
    }

    const sortDir = (request.input('sortDir') ?? 'desc') as 'asc' | 'desc'

    const query = User.notDeleted()

    if (currentUser.gymId) {
      query.where('gym_id', currentUser.gymId)
    } else if (gymIdFilter !== undefined && !Number.isNaN(Number(gymIdFilter))) {
      query.where('gym_id', Number(gymIdFilter))
    }

    if (role) query.where('role', role)
    if (status) query.where('status', status)

    if (q) {
      query.where((builder) => {
        builder.whereILike('full_name', `%${q}%`).orWhereILike('email', `%${q}%`)
      })
    }

    query.orderBy(sortBy, sortDir)

    const users = await query.paginate(page, perPage)
    const { meta, data } = users.toJSON()

    return response.status(200).send({
      message: 'Usuarios listados correctamente',
      meta,
      data,
    })
  }
}
