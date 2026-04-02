import { Status } from '#enums/status_enum'
import type ClientMembership from '#models/client_membership'

const ALLOWED_PAYMENT_STATUSES = [
  Status.PAID,
  Status.PENDING,
  Status.CANCELLED,
  Status.REFUNDED,
] as const

export function isPaymentStatus(value: string): boolean {
  return ALLOWED_PAYMENT_STATUSES.includes(value as (typeof ALLOWED_PAYMENT_STATUSES)[number])
}

export function assertAmountIsPositive(amount: string): string | null {
  if (Number.parseFloat(amount) <= 0) {
    return 'El monto debe ser mayor a 0'
  }
  return null
}

export function assertMembershipBelongsToClient(
  membership: ClientMembership,
  clientId: number
): string | null {
  if (membership.clientId !== clientId) {
    return 'La membresía no corresponde al cliente indicado'
  }
  return null
}

export function assertPaymentStatusTransition(current: string, next: string): string | null {
  if (current === next) {
    return null
  }

  if (!isPaymentStatus(current) || !isPaymentStatus(next)) {
    return 'Estado de pago inválido'
  }

  const map: Record<string, string[]> = {
    [Status.PENDING]: [Status.PAID, Status.CANCELLED],
    [Status.PAID]: [Status.REFUNDED, Status.CANCELLED],
    [Status.CANCELLED]: [],
    [Status.REFUNDED]: [],
  }

  if (!map[current].includes(next)) {
    return `No se permite cambiar el estado de "${current}" a "${next}"`
  }

  return null
}

export function assertCancelableStatus(current: string): string | null {
  if (current === Status.CANCELLED || current === Status.REFUNDED) {
    return 'Este cobro ya se encuentra cerrado y no puede cancelarse'
  }
  return null
}
