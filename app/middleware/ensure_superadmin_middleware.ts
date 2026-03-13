import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { RoleCode } from '#enums/role_enum'

export default class EnsureSuperadminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user) {
      return ctx.response.forbidden({
        message: 'Solo un superadmin puede realizar esta acción',
      })
    }
    await user.load((preloader) => preloader.load('role'))
    const roleCode = (user.role as any).code as string
    if (roleCode !== RoleCode.SUPERADMIN) {
      return ctx.response.forbidden({
        message: 'Solo un superadmin puede realizar esta acción',
      })
    }
    return next()
  }
}
