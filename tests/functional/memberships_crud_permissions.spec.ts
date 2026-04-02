import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Role from '#models/role'
import ClientMembership from '#models/client_membership'
import { TenantFactory } from '#database/factories/tenant_factory'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import { MembershipPlanFactory } from '#database/factories/membership_plan_factory'
import { ClientMembershipFactory } from '#database/factories/client_membership_factory'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { DateTime } from 'luxon'

type Response = {
  message: string
  data: { [key: string]: unknown } | { [key: string]: unknown }[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    first_page: number
    last_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
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

function baseCreatePayload(params: {
  tenantId: number
  clientId: number
  membershipPlanId: number
  startDate?: string
  endDate?: string
}) {
  return {
    tenantId: params.tenantId,
    clientId: params.clientId,
    membershipPlanId: params.membershipPlanId,
    startDate: params.startDate ?? '2025-01-01',
    endDate: params.endDate ?? '2025-02-01',
    priceAtPurchase: '100.00',
    discountAmount: '0.00',
    finalAmount: '100.00',
    status: Status.ACTIVE,
  }
}

test.group('Memberships / List – autorización y filtros', (group) => {
  group.each.setup(setupDb)

  test('listar membresías con SUPERADMIN y tenantId -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: superadminUser.id,
    }).create()
    const planB = await MembershipPlanFactory.merge({
      tenantId: tenantB.id,
      code: 'PLAN_B',
    }).create()

    await ClientMembershipFactory.merge({
      tenantId: tenantB.id,
      clientId: clientB.id,
      membershipPlanId: planB.id,
      createdBy: superadminUser.id,
    }).create()

    const response = await client
      .get(`/api/memberships?tenantId=${tenantB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Membresías listadas correctamente')
    assert.isArray(body.data)
    assert.isDefined(body.meta)
    assert.equal(body.meta!.total, 1)
    ;(body.data as { tenantId: number }[]).forEach((m) => assert.equal(m.tenantId, tenantB.id))
  })

  test('listar membresías con ADMIN solo ve su tenant -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientA = await ClientFactory.merge({
      tenantId: tenantA.id,
      createdBy: adminUser.id,
    }).create()
    const planA = await MembershipPlanFactory.merge({
      tenantId: tenantA.id,
      code: 'PLAN_A',
    }).create()

    await ClientMembershipFactory.merge({
      tenantId: tenantA.id,
      clientId: clientA.id,
      membershipPlanId: planA.id,
      createdBy: adminUser.id,
    }).create()

    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()
    const planB = await MembershipPlanFactory.merge({
      tenantId: tenantB.id,
      code: 'PLAN_B',
    }).create()

    await ClientMembershipFactory.merge({
      tenantId: tenantB.id,
      clientId: clientB.id,
      membershipPlanId: planB.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .get('/api/memberships')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.meta!.total, 1)
    ;(body.data as { tenantId: number }[]).forEach((m) => assert.equal(m.tenantId, tenantA.id))
  })

  test('listar membresías sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .get('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })

  test('listar membresías con COACH -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const coachRole = await Role.findByOrFail('code', RoleCode.COACH)
    const coachUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: coachRole.id,
    }).create()

    const response = await client
      .get('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(coachUser)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
    })
  })
})

test.group('Memberships / Show – autorización y tenant', (group) => {
  group.each.setup(setupDb)

  test('ver membresía SUPERADMIN puede ver de otro tenant -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: superadminUser.id,
    }).create()
    const planB = await MembershipPlanFactory.merge({
      tenantId: tenantB.id,
      code: 'PLAN_B',
    }).create()

    const membership = await ClientMembershipFactory.merge({
      tenantId: tenantB.id,
      clientId: clientB.id,
      membershipPlanId: planB.id,
      createdBy: superadminUser.id,
    }).create()

    const response = await client
      .get(`/api/memberships/${membership.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Membresía encontrada')
    assert.equal((body.data as { id: number }).id, membership.id)
  })

  test('ver membresía ADMIN otro tenant -> 404', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()
    const planB = await MembershipPlanFactory.merge({
      tenantId: tenantB.id,
      code: 'PLAN_B',
    }).create()

    const membership = await ClientMembershipFactory.merge({
      tenantId: tenantB.id,
      clientId: clientB.id,
      membershipPlanId: planB.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .get(`/api/memberships/${membership.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Membresía no encontrada' }] })
  })
})

test.group('Memberships / Create – validaciones y negocio', (group) => {
  group.each.setup(setupDb)

  test('crear membresía ADMIN en su tenant -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const cl = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_X',
      allowsFreeze: true,
      freezeDaysLimit: 5,
    }).create()

    const payload = {
      clientId: cl.id,
      membershipPlanId: plan.id,
      startDate: '2025-06-01',
      endDate: '2025-07-01',
      priceAtPurchase: '80.00',
      discountAmount: '10.00',
      finalAmount: '70.00',
      status: Status.ACTIVE,
      frozenDaysUsed: 0,
    }

    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(adminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Membresía creada correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenant.id)
  })

  test('crear membresía con fin antes que inicio -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const cl = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_X',
    }).create()

    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(
        baseCreatePayload({
          tenantId: tenant.id,
          clientId: cl.id,
          membershipPlanId: plan.id,
          startDate: '2025-06-15',
          endDate: '2025-06-01',
        })
      )
      .loginAs(adminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.equal(
      body.errors[0].message,
      'La fecha de fin no puede ser anterior a la fecha de inicio'
    )
  })

  test('crear membresía con importe final incoherente -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const cl = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_X',
    }).create()

    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        clientId: cl.id,
        membershipPlanId: plan.id,
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        priceAtPurchase: '100.00',
        discountAmount: '10.00',
        finalAmount: '50.00',
      })
      .loginAs(adminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.equal(
      body.errors[0].message,
      'El importe final debe coincidir con el precio menos el descuento'
    )
  })

  test('crear membresía con congelación en plan sin freeze -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const cl = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_X',
      allowsFreeze: false,
      freezeDaysLimit: 0,
    }).create()

    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        clientId: cl.id,
        membershipPlanId: plan.id,
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        priceAtPurchase: '100.00',
        discountAmount: '0.00',
        finalAmount: '100.00',
        frozenDaysUsed: 2,
      })
      .loginAs(adminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.equal(body.errors[0].message, 'Este plan no permite congelación')
  })

  test('crear membresía cliente de otro tenant -> 422', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()
    const planA = await MembershipPlanFactory.merge({
      tenantId: tenantA.id,
      code: 'PLAN_A',
    }).create()

    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({
        clientId: clientB.id,
        membershipPlanId: planA.id,
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        priceAtPurchase: '100.00',
        discountAmount: '0.00',
        finalAmount: '100.00',
      })
      .loginAs(adminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.equal(body.errors[0].message, 'El cliente no existe en este gimnasio')
  })

  test('crear membresía sin auth -> 401', async ({ client }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        clientId: 1,
        membershipPlanId: 1,
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        priceAtPurchase: '100.00',
        discountAmount: '0.00',
        finalAmount: '100.00',
      })

    response.assertStatus(401)
  })
})

test.group('Memberships / Update y Destroy', (group) => {
  group.each.setup(setupDb)

  test('actualizar membresía ADMIN -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const cl = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_X',
    }).create()

    const membership = await ClientMembershipFactory.merge({
      tenantId: tenant.id,
      clientId: cl.id,
      membershipPlanId: plan.id,
      createdBy: adminUser.id,
      startDate: DateTime.fromISO('2025-01-01'),
      endDate: DateTime.fromISO('2025-02-01'),
      priceAtPurchase: '100.00',
      discountAmount: '0.00',
      finalAmount: '100.00',
    }).create()

    const response = await client
      .patch(`/api/memberships/${membership.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ notes: 'Nota actualizada' })
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Membresía actualizada correctamente')
    assert.equal((body.data as { notes: string | null }).notes, 'Nota actualizada')
  })

  test('actualizar membresía otro tenant -> 404', async ({ client }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()
    const planB = await MembershipPlanFactory.merge({
      tenantId: tenantB.id,
      code: 'PLAN_B',
    }).create()

    const membership = await ClientMembershipFactory.merge({
      tenantId: tenantB.id,
      clientId: clientB.id,
      membershipPlanId: planB.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .patch(`/api/memberships/${membership.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({ notes: 'x' })
      .loginAs(adminUser)

    response.assertStatus(404)
  })

  test('borrar membresía ADMIN -> 200 y soft delete', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const cl = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_X',
    }).create()

    const membership = await ClientMembershipFactory.merge({
      tenantId: tenant.id,
      clientId: cl.id,
      membershipPlanId: plan.id,
      createdBy: adminUser.id,
    }).create()

    const response = await client
      .delete(`/api/memberships/${membership.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Membresía dada de baja correctamente')

    const row = await ClientMembership.query().where('id', membership.id).first()
    assert.isNotNull(row?.deletedAt)
  })

  test('COACH no puede crear membresía -> 403', async ({ client }) => {
    const tenant = await TenantFactory.create()
    const coachRole = await Role.findByOrFail('code', RoleCode.COACH)
    const coachUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: coachRole.id,
    }).create()

    const response = await client
      .post('/api/memberships')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        clientId: 1,
        membershipPlanId: 1,
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        priceAtPurchase: '100.00',
        discountAmount: '0.00',
        finalAmount: '100.00',
      })
      .loginAs(coachUser)

    response.assertStatus(403)
  })
})
