import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Branch from '#models/branch'
import PaymentMethod from '#models/payment_method'
import Payment from '#models/payment'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { updatePaymentValidator } from '#validators/payment'
import {
  assertAmountIsPositive,
  assertMembershipBelongsToClient,
  assertPaymentStatusTransition,
} from '#services/payment_business_rules'

export default class UpdatePaymentController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const payload = await request.validateUsing(updatePaymentValidator)

    let query = Payment.notDeleted().where('id', params.id)
    if (currentRole !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', currentUser.tenantId)
      delete (payload as { tenantId?: number }).tenantId
    }

    const payment = await query.first()
    if (!payment) {
      return response.status(404).send({
        errors: [{ message: 'Cobro no encontrado' }],
      })
    }

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? payment.tenantId)
        : currentUser.tenantId

    const nextClientId = payload.clientId ?? payment.clientId
    const nextMembershipId =
      payload.clientMembershipId !== undefined
        ? payload.clientMembershipId
        : payment.clientMembershipId
    const nextBranchId = payload.branchId !== undefined ? payload.branchId : payment.branchId
    const nextPaymentMethodId = payload.paymentMethodId ?? payment.paymentMethodId
    const nextAmount = payload.amount ?? payment.amount
    const nextStatus = (payload.status ?? payment.status) as string

    const amountErr = assertAmountIsPositive(nextAmount)
    if (amountErr) {
      return response.status(422).send({ errors: [{ message: amountErr }] })
    }

    const statusErr = assertPaymentStatusTransition(payment.status, nextStatus)
    if (statusErr) {
      return response.status(422).send({ errors: [{ message: statusErr }] })
    }

    const client = await Client.notDeleted()
      .where('id', nextClientId)
      .where('tenant_id', targetTenantId)
      .first()

    if (!client) {
      return response.status(422).send({
        errors: [{ message: 'El cliente no existe en este gimnasio' }],
      })
    }

    if (nextMembershipId !== undefined && nextMembershipId !== null) {
      const membership = await ClientMembership.notDeleted()
        .where('id', nextMembershipId)
        .where('tenant_id', targetTenantId)
        .first()

      if (!membership) {
        return response.status(422).send({
          errors: [{ message: 'La membresía no existe en este gimnasio' }],
        })
      }

      const membershipErr = assertMembershipBelongsToClient(membership, nextClientId)
      if (membershipErr) {
        return response.status(422).send({ errors: [{ message: membershipErr }] })
      }
    }

    if (nextBranchId !== undefined && nextBranchId !== null) {
      const branch = await Branch.notDeleted()
        .where('id', nextBranchId)
        .where('tenant_id', targetTenantId)
        .first()

      if (!branch) {
        return response.status(422).send({
          errors: [{ message: 'La sucursal no existe en este gimnasio' }],
        })
      }
    }

    const paymentMethod = await PaymentMethod.query().where('id', nextPaymentMethodId).first()
    if (!paymentMethod || paymentMethod.status !== Status.ACTIVE) {
      return response.status(422).send({
        errors: [{ message: 'El método de pago no existe o está inactivo' }],
      })
    }

    payment.merge(payload)
    await payment.save()

    await payment.load((loader) => {
      loader.load('client').load('paymentMethod').load('branch')
    })

    return response.status(200).send({
      message: 'Cobro actualizado correctamente',
      data: payment,
    })
  }
}
