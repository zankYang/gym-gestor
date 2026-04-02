import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Role from '#models/role'
import Payment from '#models/payment'
import PaymentMethod from '#models/payment_method'
import { TenantFactory } from '#database/factories/tenant_factory'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

type Response = {
  message: string
  data: { [key: string]: unknown } | { [key: string]: unknown }[]
  meta?: {
    total: number
  }
}

type ResponseError = {
  errors: { message: string; field?: string }[]
}

async function setupDb() {
  await testUtils.db().truncate()
  const syncPermissions = await ace.create(SyncPermissions, [])
  await syncPermissions.exec()
  syncPermissions.assertSucceeded()

  const syncRoles = await ace.create(SyncRoles, [])
  await syncRoles.exec()
  syncRoles.assertSucceeded()
}

async function createPaymentMethod() {
  return PaymentMethod.updateOrCreate(
    { code: 'EFECTIVO' },
    { name: 'Efectivo', status: Status.ACTIVE }
  )
}

test.group('Payments / List', (group) => {
  group.each.setup(setupDb)

  test('listar cobros con ADMIN solo ve su tenant -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const paymentMethod = await createPaymentMethod()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()
    const clientA = await ClientFactory.merge({
      tenantId: tenantA.id,
      createdBy: adminUser.id,
    }).create()
    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()

    await Payment.create({
      tenantId: tenantA.id,
      clientId: clientA.id,
      clientMembershipId: null,
      paymentMethodId: paymentMethod.id,
      branchId: null,
      amount: '50.00',
      paymentDate: DateTime.now(),
      reference: null,
      concept: 'Pago mensualidad',
      status: Status.PAID,
      notes: null,
      registeredBy: adminUser.id,
    })
    await Payment.create({
      tenantId: tenantB.id,
      clientId: clientB.id,
      clientMembershipId: null,
      paymentMethodId: paymentMethod.id,
      branchId: null,
      amount: '80.00',
      paymentDate: DateTime.now(),
      reference: null,
      concept: 'Pago mensualidad',
      status: Status.PAID,
      notes: null,
      registeredBy: adminUser.id,
    })

    const response = await client
      .get('/api/payments')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cobros listados correctamente')
    assert.equal(body.meta!.total, 1)
    ;(body.data as { tenantId: number }[]).forEach((p) => assert.equal(p.tenantId, tenantA.id))
  })

  test('listar cobros con COACH -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const coachRole = await Role.findByOrFail('code', RoleCode.COACH)
    const coachUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: coachRole.id,
    }).create()

    const response = await client
      .get('/api/payments')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(coachUser)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
    })
  })
})

test.group('Payments / Create', (group) => {
  group.each.setup(setupDb)

  test('crear cobro con RECEPCIONISTA -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)
    const receptionistUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
    }).create()
    const customer = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: receptionistUser.id,
    }).create()
    const paymentMethod = await createPaymentMethod()

    const response = await client
      .post('/api/payments')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        clientId: customer.id,
        paymentMethodId: paymentMethod.id,
        amount: '100.00',
        concept: 'Pago membresía',
        status: Status.PAID,
      })
      .loginAs(receptionistUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cobro creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenant.id)
  })

  test('crear cobro con amount inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const customer = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const paymentMethod = await createPaymentMethod()

    const response = await client
      .post('/api/payments')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        clientId: customer.id,
        paymentMethodId: paymentMethod.id,
        amount: '0.00',
        concept: 'Pago membresía',
      })
      .loginAs(adminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.equal(body.errors[0].message, 'El monto debe ser mayor a 0')
  })
})

test.group('Payments / Update y Cancel', (group) => {
  group.each.setup(setupDb)

  test('actualizar cobro ADMIN -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const customer = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const paymentMethod = await createPaymentMethod()
    const payment = await Payment.create({
      tenantId: tenant.id,
      clientId: customer.id,
      clientMembershipId: null,
      paymentMethodId: paymentMethod.id,
      branchId: null,
      amount: '90.00',
      paymentDate: DateTime.now(),
      reference: null,
      concept: 'Pago inicial',
      status: Status.PENDING,
      notes: null,
      registeredBy: adminUser.id,
    })

    const response = await client
      .patch(`/api/payments/${payment.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ status: Status.PAID, amount: '90.00' })
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cobro actualizado correctamente')
    assert.equal((body.data as { status: string }).status, Status.PAID)
  })

  test('cancelar cobro con RECEPCIONISTA (sin cancel) -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const receptionistUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
    }).create()
    const customer = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const paymentMethod = await createPaymentMethod()
    const payment = await Payment.create({
      tenantId: tenant.id,
      clientId: customer.id,
      clientMembershipId: null,
      paymentMethodId: paymentMethod.id,
      branchId: null,
      amount: '100.00',
      paymentDate: DateTime.now(),
      reference: null,
      concept: 'Pago membresía',
      status: Status.PAID,
      notes: null,
      registeredBy: adminUser.id,
    })

    const response = await client
      .post(`/api/payments/${payment.id}/cancel`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ reason: 'Error de registro', status: Status.CANCELLED })
      .loginAs(receptionistUser)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
    })
  })

  test('cancelar cobro con ADMIN -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const customer = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const paymentMethod = await createPaymentMethod()
    const payment = await Payment.create({
      tenantId: tenant.id,
      clientId: customer.id,
      clientMembershipId: null,
      paymentMethodId: paymentMethod.id,
      branchId: null,
      amount: '100.00',
      paymentDate: DateTime.now(),
      reference: null,
      concept: 'Pago membresía',
      status: Status.PAID,
      notes: null,
      registeredBy: adminUser.id,
    })

    const response = await client
      .post(`/api/payments/${payment.id}/cancel`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ reason: 'Devolución solicitada', status: Status.REFUNDED })
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Cobro cancelado correctamente')
    assert.equal((body.data as { status: string }).status, Status.REFUNDED)
  })
})
