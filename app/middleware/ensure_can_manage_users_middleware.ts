import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Role } from '#enums/role_enum'

const ALLOWED_ROLES = [Role.SUPERADMIN, Role.ADMIN] as const

/**
 * Permite acceso solo a superadmin (gestión global) o admin (gestión de usuarios de su tenant).
 * Los controladores de user deben filtrar por tenantId cuando el usuario es admin.
 */
export default class EnsureCanManageUsersMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user) {
      return ctx.response.unauthorized({
        message: 'Debes iniciar sesión para gestionar usuarios',
      })
    }
    await user.load((preloader) => preloader.load('role'))
    const roleCode = (user.role as any).code as string
    if (!ALLOWED_ROLES.includes(roleCode as (typeof ALLOWED_ROLES)[number])) {
      return ctx.response.forbidden({
        errors: [
          {
            message: 'Solo superadmin o admin del gym pueden gestionar usuarios',
          },
        ],
      })
    }
    return next()
  }
}
