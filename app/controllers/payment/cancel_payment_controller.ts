import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { cancelPaymentValidator } from '#validators/payment'
import { assertCancelableStatus } from '#services/payment_business_rules'

export default class CancelPaymentController {
  async cancel({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code
    const payload = await request.validateUsing(cancelPaymentValidator)

    const query = Payment.notDeleted().where('id', params.id)
    if (currentRole !== RoleCode.SUPERADMIN) {
      query.where('tenant_id', currentUser.tenantId)
    }

    const payment = await query.first()
    if (!payment) {
      return response.status(404).send({
        errors: [{ message: 'Cobro no encontrado' }],
      })
    }

    const cancelErr = assertCancelableStatus(payment.status)
    if (cancelErr) {
      return response.status(422).send({
        errors: [{ message: cancelErr }],
      })
    }

    payment.status = payload.status ?? Status.CANCELLED
    const reasonText = `Motivo de cancelación/reembolso: ${payload.reason}`
    payment.notes = payment.notes ? `${payment.notes}\n${reasonText}` : reasonText
    await payment.save()

    return response.status(200).send({
      message: 'Cobro cancelado correctamente',
      data: payment,
    })
  }
}
