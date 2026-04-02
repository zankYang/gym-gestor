import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import ClientMembership from '#models/client_membership'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

export default class UpdateMembershipStatuses extends BaseCommand {
  static commandName = 'memberships:update-status'
  static description = 'Actualiza el estado de las membresías según su vigencia'
  static options: CommandOptions = {
    startApp: true,
  }

  public async run() {
    const today = DateTime.local().startOf('day')

    const memberships = await ClientMembership.notDeleted().whereIn('status', [
      Status.ACTIVE,
      Status.FROZEN,
      Status.EXPIRED,
    ])

    let updated = 0

    for (const membership of memberships) {
      const endDate = membership.endDate
      const frozenDaysUsed = membership.frozenDaysUsed || 0

      if (!endDate) {
        continue
      }

      const effectiveEndDate = endDate.startOf('day').plus({ days: frozenDaysUsed })

      let nextStatus = membership.status

      if (effectiveEndDate.toMillis() < today.toMillis()) {
        nextStatus = Status.EXPIRED
      } else {
        if (membership.status === Status.EXPIRED) {
          nextStatus = Status.ACTIVE
        }
      }

      if (nextStatus !== membership.status) {
        membership.status = nextStatus
        await membership.save()
        updated++
      }
    }

    this.logger.success(`Membresías revisadas: ${memberships.length}`)
    this.logger.success(`Membresías actualizadas: ${updated}`)
  }
}
