import factory from '@adonisjs/lucid/factories'
import AuditLog from '#models/audit_log'

const ENTITY_TYPES = ['User', 'Client', 'Payment', 'ClientMembership', 'Attendance', 'Routine']
const ACTIONS = ['create', 'update', 'delete', 'login', 'logout']

export const AuditLogFactory = factory
  .define(AuditLog, ({ faker }) => {
    return {
      tenantId: 1,
      userId: faker.number.int({ min: 1, max: 5 }),
      entityType: faker.helpers.arrayElement(ENTITY_TYPES),
      entityId: faker.number.int({ min: 1, max: 100 }),
      action: faker.helpers.arrayElement(ACTIONS),
      oldValues: null,
      newValues: null,
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
    }
  })
  .build()
