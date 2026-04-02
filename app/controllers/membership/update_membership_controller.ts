import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import MembershipPlan from '#models/membership_plan'
import Branch from '#models/branch'
import ClientMembership from '#models/client_membership'
import { RoleCode } from '#enums/role_enum'
import { updateMembershipValidator } from '#validators/membership'
import {
  assertDiscountNotExceedsPrice,
  assertEndDateNotBeforeStart,
  assertFinalAmountCoherent,
  assertFreezeAgainstPlan,
} from '#services/membership_business_rules'

export default class UpdateMembershipController {
  async update({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail()
    const currentRole = currentUser.role.code

    const payload = await request.validateUsing(updateMembershipValidator)

    let query = ClientMembership.notDeleted().where('id', params.id)

    if (currentRole !== RoleCode.SUPERADMIN) {
      query = query.where('tenant_id', currentUser.tenantId)
      delete (payload as { tenantId?: number }).tenantId
    }

    const membership = await query.first()

    if (!membership) {
      return response.status(404).send({
        errors: [{ message: 'Membresía no encontrada' }],
      })
    }

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN
        ? (payload.tenantId ?? membership.tenantId)
        : currentUser.tenantId

    const nextClientId = payload.clientId ?? membership.clientId
    const nextPlanId = payload.membershipPlanId ?? membership.membershipPlanId
    const nextBranchId = payload.branchId !== undefined ? payload.branchId : membership.branchId

    const client = await Client.notDeleted()
      .where('id', nextClientId)
      .where('tenant_id', targetTenantId)
      .first()

    if (!client) {
      return response.status(422).send({
        errors: [{ message: 'El cliente no existe en este gimnasio' }],
      })
    }

    const plan = await MembershipPlan.notDeleted()
      .where('id', nextPlanId)
      .where('tenant_id', targetTenantId)
      .first()

    if (!plan) {
      return response.status(422).send({
        errors: [{ message: 'El plan no existe en este gimnasio' }],
      })
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

    const startDate = payload.startDate ?? membership.startDate
    const endDate = payload.endDate ?? membership.endDate

    const dateErr = assertEndDateNotBeforeStart(startDate, endDate)
    if (dateErr) {
      return response.status(422).send({ errors: [{ message: dateErr }] })
    }

    const priceAtPurchase = payload.priceAtPurchase ?? membership.priceAtPurchase
    const discountAmount = payload.discountAmount ?? membership.discountAmount
    const finalAmount = payload.finalAmount ?? membership.finalAmount

    const discErr = assertDiscountNotExceedsPrice(priceAtPurchase, discountAmount)
    if (discErr) {
      return response.status(422).send({ errors: [{ message: discErr }] })
    }

    const finalErr = assertFinalAmountCoherent(priceAtPurchase, discountAmount, finalAmount)
    if (finalErr) {
      return response.status(422).send({ errors: [{ message: finalErr }] })
    }

    const frozenDaysUsed = payload.frozenDaysUsed ?? membership.frozenDaysUsed
    const freezeErr = assertFreezeAgainstPlan(plan, frozenDaysUsed)
    if (freezeErr) {
      return response.status(422).send({ errors: [{ message: freezeErr }] })
    }

    membership.merge(payload)
    membership.updatedBy = currentUser.id
    await membership.save()

    await membership.load((loader) => {
      loader.load('client').load('membershipPlan').load('branch')
    })

    return response.status(200).send({
      message: 'Membresía actualizada correctamente',
      data: membership,
    })
  }
}
