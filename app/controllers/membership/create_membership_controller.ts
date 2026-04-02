import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import MembershipPlan from '#models/membership_plan'
import Branch from '#models/branch'
import ClientMembership from '#models/client_membership'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { createMembershipValidator } from '#validators/membership'
import {
  assertDiscountNotExceedsPrice,
  assertEndDateNotBeforeStart,
  assertFinalAmountCoherent,
  assertFreezeAgainstPlan,
} from '#services/membership_business_rules'

export default class CreateMembershipController {
  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createMembershipValidator)
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? currentUser.tenantId)
        : currentUser.tenantId

    const client = await Client.notDeleted()
      .where('id', payload.clientId)
      .where('tenant_id', targetTenantId)
      .first()

    if (!client) {
      return response.status(422).send({
        errors: [{ message: 'El cliente no existe en este gimnasio' }],
      })
    }

    const plan = await MembershipPlan.notDeleted()
      .where('id', payload.membershipPlanId)
      .where('tenant_id', targetTenantId)
      .first()

    if (!plan) {
      return response.status(422).send({
        errors: [{ message: 'El plan no existe en este gimnasio' }],
      })
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

    const startDate = payload.startDate
    const endDate = payload.endDate

    const dateErr = assertEndDateNotBeforeStart(startDate, endDate)
    if (dateErr) {
      return response.status(422).send({ errors: [{ message: dateErr }] })
    }

    const discErr = assertDiscountNotExceedsPrice(payload.priceAtPurchase, payload.discountAmount)
    if (discErr) {
      return response.status(422).send({ errors: [{ message: discErr }] })
    }

    const finalErr = assertFinalAmountCoherent(
      payload.priceAtPurchase,
      payload.discountAmount,
      payload.finalAmount
    )
    if (finalErr) {
      return response.status(422).send({ errors: [{ message: finalErr }] })
    }

    const frozenDaysUsed = payload.frozenDaysUsed ?? 0
    const freezeErr = assertFreezeAgainstPlan(plan, frozenDaysUsed)
    if (freezeErr) {
      return response.status(422).send({ errors: [{ message: freezeErr }] })
    }

    const membership = await ClientMembership.create({
      tenantId: targetTenantId,
      clientId: payload.clientId,
      membershipPlanId: payload.membershipPlanId,
      branchId: payload.branchId ?? null,
      startDate,
      endDate,
      status: payload.status ?? Status.PENDING,
      priceAtPurchase: payload.priceAtPurchase,
      discountAmount: payload.discountAmount,
      finalAmount: payload.finalAmount,
      autoRenew: payload.autoRenew ?? false,
      frozenDaysUsed,
      notes: payload.notes ?? null,
      createdBy: currentUser.id,
      updatedBy: null,
    })

    await membership.load((loader) => {
      loader.load('client').load('membershipPlan').load('branch')
    })

    return response.status(201).send({
      message: 'Membresía creada correctamente',
      data: membership,
    })
  }
}
