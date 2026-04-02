import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import ace from '@adonisjs/core/services/ace'
import { DateTime } from 'luxon'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Role from '#models/role'
import Attendance from '#models/attendance'
import { TenantFactory } from '#database/factories/tenant_factory'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import { MembershipPlanFactory } from '#database/factories/membership_plan_factory'
import { ClientMembershipFactory } from '#database/factories/client_membership_factory'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'

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

test.group('Attendances / List', (group) => {
  group.each.setup(setupDb)

  test('listar asistencias con ADMIN solo ve su tenant -> 200', async ({ client, assert }) => {
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
    const clientB = await ClientFactory.merge({
      tenantId: tenantB.id,
      createdBy: adminUser.id,
    }).create()

    await Attendance.create({
      tenantId: tenantA.id,
      clientId: clientA.id,
      clientMembershipId: null,
      branchId: null,
      attendanceDate: DateTime.now().startOf('day'),
      checkInAt: DateTime.now(),
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: adminUser.id,
      notes: null,
    })
    await Attendance.create({
      tenantId: tenantB.id,
      clientId: clientB.id,
      clientMembershipId: null,
      branchId: null,
      attendanceDate: DateTime.now().startOf('day'),
      checkInAt: DateTime.now(),
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: adminUser.id,
      notes: null,
    })

    const response = await client
      .get('/api/attendances')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Asistencias listadas correctamente')
    assert.equal(body.meta!.total, 1)
  })

  test('listar asistencias con COACH (tiene attendances:view) -> 200', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const coachRole = await Role.findByOrFail('code', RoleCode.COACH)
    const coachUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: coachRole.id,
    }).create()

    const response = await client
      .get('/api/attendances')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(coachUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Asistencias listadas correctamente')
  })
})

test.group('Attendances / Checkin Checkout', (group) => {
  group.each.setup(setupDb)

  test('checkin válido con recepcionista -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)
    const receptionistUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
    }).create()
    const gymClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: receptionistUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_ATT',
    }).create()
    await ClientMembershipFactory.merge({
      tenantId: tenant.id,
      clientId: gymClient.id,
      membershipPlanId: plan.id,
      status: Status.ACTIVE,
      createdBy: receptionistUser.id,
    }).create()

    const response = await client
      .post('/api/attendances/checkin')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ clientId: gymClient.id })
      .loginAs(receptionistUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Check-in registrado correctamente')
    assert.equal((body.data as { status: string }).status, Status.CHECKED_IN)
  })

  test('doble checkin del mismo cliente abierto -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const gymClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const plan = await MembershipPlanFactory.merge({
      tenantId: tenant.id,
      code: 'PLAN_ATT',
    }).create()
    await ClientMembershipFactory.merge({
      tenantId: tenant.id,
      clientId: gymClient.id,
      membershipPlanId: plan.id,
      status: Status.ACTIVE,
      createdBy: adminUser.id,
    }).create()

    await Attendance.create({
      tenantId: tenant.id,
      clientId: gymClient.id,
      clientMembershipId: null,
      branchId: null,
      attendanceDate: DateTime.now().startOf('day'),
      checkInAt: DateTime.now(),
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: adminUser.id,
      notes: null,
    })

    const response = await client
      .post('/api/attendances/checkin')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ clientId: gymClient.id })
      .loginAs(adminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.equal(body.errors[0].message, 'El cliente ya tiene una asistencia abierta')
  })

  test('checkout exitoso -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const gymClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const attendance = await Attendance.create({
      tenantId: tenant.id,
      clientId: gymClient.id,
      clientMembershipId: null,
      branchId: null,
      attendanceDate: DateTime.now().startOf('day'),
      checkInAt: DateTime.now().minus({ hours: 1 }),
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: adminUser.id,
      notes: null,
    })

    const response = await client
      .post(`/api/attendances/${attendance.id}/checkout`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({})
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Checkout registrado correctamente')
    assert.equal((body.data as { status: string }).status, Status.CHECKED_OUT)
  })
})

test.group('Attendances / CRUD y auth', (group) => {
  group.each.setup(setupDb)

  test('crear asistencia manual sin auth -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .post('/api/attendances')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ clientId: 1 })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })

  test('delete asistencia con RECEPCIONISTA -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const receptionistRole = await Role.findByOrFail('code', RoleCode.RECEPTIONIST)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()
    const receptionist = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: receptionistRole.id,
    }).create()
    const gymClient = await ClientFactory.merge({
      tenantId: tenant.id,
      createdBy: adminUser.id,
    }).create()
    const attendance = await Attendance.create({
      tenantId: tenant.id,
      clientId: gymClient.id,
      clientMembershipId: null,
      branchId: null,
      attendanceDate: DateTime.now().startOf('day'),
      checkInAt: DateTime.now(),
      checkOutAt: null,
      status: Status.CHECKED_IN,
      registeredBy: adminUser.id,
      notes: null,
    })

    const response = await client
      .delete(`/api/attendances/${attendance.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(receptionist)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
    })
  })
})
