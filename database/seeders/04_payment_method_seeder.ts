import { BaseSeeder } from '@adonisjs/lucid/seeders'
import PaymentMethod from '#models/payment_method'
import { Status } from '#enums/status_enum'
import { PaymentMethod as PaymentMethodEnum } from '#enums/payment_method_enum'

export default class PaymentMethodSeeder extends BaseSeeder {
  async run() {
    const methods = [
      { name: PaymentMethodEnum.CASH, code: PaymentMethodEnum.CASH, status: Status.ACTIVE },
      { name: PaymentMethodEnum.TRANSFER, code: PaymentMethodEnum.TRANSFER, status: Status.ACTIVE },
      { name: PaymentMethodEnum.CARD, code: PaymentMethodEnum.CARD, status: Status.ACTIVE },
      { name: PaymentMethodEnum.OTHER, code: PaymentMethodEnum.OTHER, status: Status.ACTIVE },
    ]

    for (const method of methods) {
      await PaymentMethod.firstOrCreate({ code: method.code }, method)
    }
  }
}
