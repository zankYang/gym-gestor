import factory from '@adonisjs/lucid/factories'
import Notification from '#models/notification'
import { Status } from '#enums/status_enum'

const CHANNELS = ['email', 'sms', 'push', 'internal']
const RECIPIENT_TYPES = ['user', 'client', 'trainer']

export const NotificationFactory = factory
  .define(Notification, ({ faker }) => {
    return {
      tenantId: 1,
      recipientType: faker.helpers.arrayElement(RECIPIENT_TYPES),
      recipientId: faker.number.int({ min: 1, max: 10 }),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      message: faker.lorem.paragraph(),
      channel: faker.helpers.arrayElement(CHANNELS),
      status: Status.PENDING,
      sentAt: null,
      readAt: null,
    }
  })
  .build()
