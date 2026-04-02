import { type DateTime } from 'luxon'
import { Status } from '#enums/status_enum'

export const AttendanceEventType = {
  CHECKIN: 'checkin',
  CHECKOUT: 'checkout',
  DENIED: 'denied',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
  REOPEN: 'reopen',
} as const

export type AttendanceEventTypeValue =
  (typeof AttendanceEventType)[keyof typeof AttendanceEventType]

export function assertCheckOutAfterCheckIn(
  checkInAt: DateTime,
  checkOutAt: DateTime
): string | null {
  if (checkOutAt.toMillis() < checkInAt.toMillis()) {
    return 'La salida no puede ser anterior al check-in'
  }
  return null
}

export function assertOpenAttendanceStatus(status: string): string | null {
  if (status !== Status.CHECKED_IN) {
    return 'La asistencia no está abierta para registrar checkout'
  }
  return null
}

export function assertMembershipActiveForCheckin(status: string): string | null {
  if (status !== Status.ACTIVE && status !== Status.FROZEN) {
    return 'La membresía no está habilitada para ingreso'
  }
  return null
}

export function assertNoOpenAttendance(openAttendanceExists: boolean): string | null {
  if (openAttendanceExists) {
    return 'El cliente ya tiene una asistencia abierta'
  }
  return null
}
