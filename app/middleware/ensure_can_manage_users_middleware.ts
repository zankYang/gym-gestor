import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Role } from '#enums/role_enum'

const ALLOWED_ROLES = [Role.SUPERADMIN, Role.ADMIN] as const

/**
 * Permite acceso solo a superadmin (gestión global) o admin (gestión de usuarios de su gym).
 * Los controladores de user deben filtrar por gymId cuando el usuario es admin.
 */
export default class EnsureCanManageUsersMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user) {
      return ctx.response.unauthorized({
        message: 'Debes iniciar sesión para gestionar usuarios',
      })
    }
    if (!ALLOWED_ROLES.includes(user.role as (typeof ALLOWED_ROLES)[number])) {
      return ctx.response.forbidden({
        errors: [
          {
            message: 'Solo superadmin o admin del gym pueden gestionar usuarios',
          },
        ],
      })
    }
    if (user.role === Role.ADMIN && user.gymId === null) {
      return ctx.response.forbidden({
        message: 'El admin debe estar asociado a un gym',
      })
    }
    return next()
  }
}
