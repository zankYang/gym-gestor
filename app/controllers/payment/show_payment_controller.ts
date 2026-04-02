import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import { RoleCode } from '#enums/role_enum'

export default class ShowPaymentController {
  async show({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const query = Payment.notDeleted()
      .where('id', params.id)
      .preload('client')
      .preload('paymentMethod')
      .preload('branch')
      .preload('registeredByUser')

    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const payment = await query.first()

    if (!payment) {
      return response.status(404).send({
        errors: [{ message: 'Cobro no encontrado' }],
      })
    }

    return response.status(200).send({
      message: 'Cobro encontrado',
      data: payment,
    })
  }
}
