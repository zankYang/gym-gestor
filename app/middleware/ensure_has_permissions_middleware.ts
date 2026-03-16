import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { type PermissionCode } from '#enums/permissions_enum'

/**
 * Verifica que el usuario autenticado tenga todos los permisos indicados.
 * No depende del rol: cualquier rol que cuente con los permisos requeridos pasará.
 *
 * Uso en rutas:
 *   .use([middleware.auth(), middleware.hasPermissions([PermissionCode.USERS_MANAGE])])
 */
export default class EnsureHasPermissionsMiddleware {
  async handle(ctx: HttpContext, next: NextFn, requiredPermissions: PermissionCode[] = []) {
    const user = ctx.auth.user!

    if (requiredPermissions.length === 0) {
      return next()
    }

    await user.load((preloader) =>
      preloader.load('role', (roleQuery) => roleQuery.preload('permissions'))
    )

    const userPermissions = user.allPermissions
    const missingPermissions = requiredPermissions.filter(
      (permission) => !userPermissions.includes(permission)
    )

    if (missingPermissions.length > 0) {
      return ctx.response.forbidden({
        errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
      })
    }

    return next()
  }
}
