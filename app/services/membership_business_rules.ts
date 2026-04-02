import type { DateTime } from 'luxon'
import type MembershipPlan from '#models/membership_plan'

export function assertEndDateNotBeforeStart(startDate: DateTime, endDate: DateTime): string | null {
  const s = startDate.startOf('day')
  const e = endDate.startOf('day')
  if (e < s) {
    return 'La fecha de fin no puede ser anterior a la fecha de inicio'
  }
  return null
}

export function assertDiscountNotExceedsPrice(
  priceAtPurchase: string,
  discountAmount: string
): string | null {
  if (Number.parseFloat(discountAmount) > Number.parseFloat(priceAtPurchase)) {
    return 'El descuento no puede ser mayor al precio de compra'
  }
  return null
}

export function assertFinalAmountCoherent(
  priceAtPurchase: string,
  discountAmount: string,
  finalAmount: string
): string | null {
  const expected = Number.parseFloat(priceAtPurchase) - Number.parseFloat(discountAmount)
  const final = Number.parseFloat(finalAmount)
  if (Math.abs(final - expected) >= 0.005) {
    return 'El importe final debe coincidir con el precio menos el descuento'
  }
  return null
}

export function assertFreezeAgainstPlan(
  plan: MembershipPlan,
  frozenDaysUsed: number
): string | null {
  if (frozenDaysUsed <= 0) {
    return null
  }
  if (!plan.allowsFreeze) {
    return 'Este plan no permite congelación'
  }
  if (frozenDaysUsed > plan.freezeDaysLimit) {
    return 'Los días de congelación usados superan el límite del plan'
  }
  return null
}
