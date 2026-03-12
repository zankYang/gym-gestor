import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tenant from '#models/tenant'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    tenant: Tenant
  }
}

export default class IdentifyTenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const hostname = ctx.request.hostname()

    if (!hostname) {
      return ctx.response.badRequest({
        message: 'No se pudo resolver el host de la petición',
      })
    }
    console.log(hostname)
    const subdomain = hostname.split('.')[0]
    const tenant = await Tenant.query().where('slug', subdomain).first()

    if (!tenant) {
      return ctx.response.notFound({
        message: 'Plataforma no válida',
      })
    }

    ctx.tenant = tenant

    await next()
  }
}
