import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsureSuperadminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user || user.role !== 'superadmin') {
      return ctx.response.forbidden({
        message: 'Solo un superadmin puede realizar esta acción',
      })
    }
    return next()
  }
}
