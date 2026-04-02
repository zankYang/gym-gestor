import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import ClientMembership from '#models/client_membership'
import Branch from '#models/branch'
import PaymentMethod from '#models/payment_method'
import Payment from '#models/payment'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { createPaymentValidator } from '#validators/payment'
import {
  assertAmountIsPositive,
  assertMembershipBelongsToClient,
} from '#services/payment_business_rules'

export default class CreatePaymentController {
  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createPaymentValidator)
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? currentUser.tenantId)
        : currentUser.tenantId

    const amountErr = assertAmountIsPositive(payload.amount)
    if (amountErr) {
      return response.status(422).send({ errors: [{ message: amountErr }] })
    }

    const client = await Client.notDeleted()
      .where('id', payload.clientId)
      .where('tenant_id', targetTenantId)
      .first()

    if (!client) {
      return response.status(422).send({
        errors: [{ message: 'El cliente no existe en este gimnasio' }],
      })
    }

    let membership: ClientMembership | null = null
    if (payload.clientMembershipId !== undefined && payload.clientMembershipId !== null) {
      membership = await ClientMembership.notDeleted()
        .where('id', payload.clientMembershipId)
        .where('tenant_id', targetTenantId)
        .first()

      if (!membership) {
        return response.status(422).send({
          errors: [{ message: 'La membresía no existe en este gimnasio' }],
        })
      }

      const membershipErr = assertMembershipBelongsToClient(membership, payload.clientId)
      if (membershipErr) {
        return response.status(422).send({ errors: [{ message: membershipErr }] })
      }
    }

    if (payload.branchId !== undefined && payload.branchId !== null) {
      const branch = await Branch.notDeleted()
        .where('id', payload.branchId)
        .where('tenant_id', targetTenantId)
        .first()

      if (!branch) {
        return response.status(422).send({
          errors: [{ message: 'La sucursal no existe en este gimnasio' }],
        })
      }
    }

    const paymentMethod = await PaymentMethod.query().where('id', payload.paymentMethodId).first()
    if (!paymentMethod || paymentMethod.status !== Status.ACTIVE) {
      return response.status(422).send({
        errors: [{ message: 'El método de pago no existe o está inactivo' }],
      })
    }

    const payment = await Payment.create({
      tenantId: targetTenantId!,
      clientId: payload.clientId,
      clientMembershipId: payload.clientMembershipId ?? null,
      paymentMethodId: payload.paymentMethodId,
      branchId: payload.branchId ?? null,
      amount: payload.amount,
      paymentDate: payload.paymentDate ?? undefined,
      reference: payload.reference ?? null,
      concept: payload.concept,
      status: payload.status ?? Status.PAID,
      notes: payload.notes ?? null,
      registeredBy: currentUser.id,
    })

    await payment.load((loader) => {
      loader.load('client').load('paymentMethod').load('branch')
    })

    return response.status(201).send({
      message: 'Cobro creado correctamente',
      data: payment,
    })
  }
}
