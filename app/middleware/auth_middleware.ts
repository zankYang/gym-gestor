import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import type User from '#models/user'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */

declare module '@adonisjs/core/http' {
  interface HttpContext {
    consumer: User
  }
}
export default class AuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards)
      const user = ctx.auth.getUserOrFail()
      await user.load((preloader) => preloader.load('role'))
      ctx.consumer = user
      return next()
    } catch {
      return ctx.response.unauthorized({
        errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
      })
    }
  }
}
