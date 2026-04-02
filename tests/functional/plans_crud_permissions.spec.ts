import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import ace from '@adonisjs/core/services/ace'
import SyncRoles from '#commands/sync_roles'
import SyncPermissions from '#commands/sync_permissions'
import Role from '#models/role'
import MembershipPlan from '#models/membership_plan'
import { TenantFactory } from '#database/factories/tenant_factory'
import { UserFactory } from '#database/factories/user_factory'
import { RoleCode } from '#enums/role_enum'
import { Status } from '#enums/status_enum'
import { MembershipPlanFactory } from '#database/factories/membership_plan_factory'

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

function createPlanPayload(params: {
  tenantId: number
  name: string
  code: string
  price?: string
  durationDays?: number
  status?: Status
}) {
  return {
    tenantId: params.tenantId,
    name: params.name,
    code: params.code,
    description: null,
    durationDays: params.durationDays ?? 30,
    price: params.price ?? '50.00',
    allowsClasses: false,
    allowsFreeze: false,
    freezeDaysLimit: 0,
    status: params.status ?? Status.ACTIVE,
  }
}

async function createPlan(tenantId: number, code: string, name = 'Plan') {
  // Usamos la factory solo para garantizar defaults y luego sobreescribimos campos críticos
  return MembershipPlanFactory.merge(
    createPlanPayload({
      tenantId,
      name,
      code,
    })
  ).create()
}

test.group('Plans / List - autorización y filtros', (group) => {
  group.each.setup(setupDb)

  test('listar planes con SUPERADMIN y tenantId -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    await createPlan(tenantA.id, 'A_1', 'Plan A 1')
    await createPlan(tenantA.id, 'A_2', 'Plan A 2')
    await createPlan(tenantB.id, 'B_1', 'Plan B 1')
    await createPlan(tenantB.id, 'B_2', 'Plan B 2')

    const response = await client
      .get(`/api/plans?tenantId=${tenantB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Planes listados correctamente')
    assert.isArray(body.data)
    assert.isDefined(body.meta)
    assert.equal(body.meta!.total, 2)
    ;(body.data as { tenantId: number }[]).forEach((p) => assert.equal(p.tenantId, tenantB.id))
  })

  test('listar planes con ADMIN solo ve su tenant -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    await createPlan(tenantA.id, 'A_1', 'Plan A 1')
    await createPlan(tenantA.id, 'A_2', 'Plan A 2')
    await createPlan(tenantB.id, 'B_1', 'Plan B 1')
    await createPlan(tenantB.id, 'B_2', 'Plan B 2')

    const response = await client
      .get('/api/plans')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Planes listados correctamente')
    assert.isArray(body.data)
    assert.isDefined(body.meta)
    assert.equal(body.meta!.total, 2)
    ;(body.data as { tenantId: number }[]).forEach((p) => assert.equal(p.tenantId, tenantA.id))
  })

  test('listar planes sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .get('/api/plans')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })

  test('listar planes con page inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/plans?page=abc')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'page'))
  })

  test('listar planes con sortDir inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/plans?sortDir=NOPE')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'sortDir'))
  })

  test('listar planes con status inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)

    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const response = await client
      .get('/api/plans?status=NoExiste')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'status'))
  })

  test('listar planes con tenantId inválido en ADMIN -> 200 (se ignora)', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    await createPlan(tenantA.id, 'A_1', 'Plan A 1')
    await createPlan(tenantB.id, 'B_1', 'Plan B 1')

    const response = await client
      .get('/api/plans?tenantId=abc')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.isTrue((body.data as { tenantId: number }[]).every((p) => p.tenantId === tenantA.id))
  })

  test('listar planes con rol sin permisos (COACH) -> 403', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const coachRole = await Role.findByOrFail('code', RoleCode.COACH)

    const coachUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: coachRole.id,
    }).create()

    await createPlan(tenant.id, 'C_1', 'Plan Coach 1')

    const response = await client
      .get('/api/plans')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(coachUser)

    response.assertStatus(403)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'No tienes los permisos necesarios para realizar esta acción' }],
    })
  })
})

test.group('Plans / Show - autorización y tenant', (group) => {
  group.each.setup(setupDb)

  test('ver plan SUPERADMIN puede ver plan de otro tenant -> 200', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const planInB = await createPlan(tenantB.id, 'B_1', 'Plan B 1')

    const response = await client
      .get(`/api/plans/${planInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(superadminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Plan encontrado')
    assert.equal((body.data as { id: number }).id, planInB.id)
  })

  test('ver plan normal (ADMIN) puede ver plan de su tenant -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const planInTenant = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .get(`/api/plans/${planInTenant.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Plan encontrado')
    assert.equal((body.data as { id: number }).id, planInTenant.id)
  })

  test('ver plan normal intentando acceder a plan de otro tenant -> 404', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const planInB = await createPlan(tenantB.id, 'B_1', 'Plan B 1')

    const response = await client
      .get(`/api/plans/${planInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Plan no encontrado' }] })
  })

  test('ver plan sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const planInTenant = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .get(`/api/plans/${planInTenant.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)

    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('Plans / Create - validaciones y permisos', (group) => {
  group.each.setup(setupDb)

  test('crear plan SUPERADMIN en tenant específico -> 201', async ({ client, assert }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      tenantId: tenantB.id,
      name: 'Plan B',
      code: 'B_PLAN',
      description: 'Descripción del plan',
      durationDays: 30,
      price: '50.00',
      allowsClasses: false,
      allowsFreeze: true,
      freezeDaysLimit: 5,
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/plans')
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Plan creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenantB.id)
  })

  test('crear plan normal (ADMIN) en su tenant -> 201', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const payload = {
      name: 'Plan A',
      code: 'A_PLAN',
      description: 'Descripción del plan',
      durationDays: 30,
      price: '50.00',
      allowsClasses: false,
      allowsFreeze: false,
      freezeDaysLimit: 0,
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/plans')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(adminUser)

    response.assertStatus(201)
    const body = response.body()! as Response
    assert.equal(body.message, 'Plan creado correctamente')
    assert.equal((body.data as { tenantId: number }).tenantId, tenant.id)
  })

  test('crear plan con payload inválido (sin code) -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const payload = {
      tenantId: tenant.id,
      name: 'Plan inválido',
      durationDays: 30,
      price: '50.00',
      allowsClasses: false,
      allowsFreeze: false,
      freezeDaysLimit: 0,
      status: Status.ACTIVE,
    }

    const response = await client
      .post('/api/plans')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json(payload)
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'code'))
  })

  test('crear plan sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const response = await client
      .post('/api/plans')
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({
        name: 'Plan A',
        code: 'A_PLAN',
        durationDays: 30,
        price: '50.00',
        allowsClasses: false,
        allowsFreeze: false,
        freezeDaysLimit: 0,
        status: Status.ACTIVE,
      })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('Plans / Update - validaciones y tenant', (group) => {
  group.each.setup(setupDb)

  test('actualizar plan ADMIN puede actualizar su plan -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const plan = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .patch(`/api/plans/${plan.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ name: 'Plan actualizado' })
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Plan actualizado correctamente')
    assert.equal((body.data as { name: string }).name, 'Plan actualizado')
  })

  test('actualizar plan normal intentando actualizar plan de otro tenant -> 404', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const planInB = await createPlan(tenantB.id, 'B_1', 'Plan B 1')

    const response = await client
      .patch(`/api/plans/${planInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .json({ name: 'No' })
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Plan no encontrado' }] })
  })

  test('actualizar plan con status inválido -> 422', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const plan = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .patch(`/api/plans/${plan.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ status: 'NoExiste' })
      .loginAs(superadminUser)

    response.assertStatus(422)
    const body = response.body()! as ResponseError
    assert.isTrue(body.errors.some((e) => e.field === 'status'))
  })

  test('actualizar plan con código duplicado en el mismo tenant -> 409', async ({
    client,
    assert,
  }) => {
    const tenant = await TenantFactory.create()
    const superadminRole = await Role.findByOrFail('code', RoleCode.SUPERADMIN)
    const superadminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: superadminRole.id,
    }).create()

    const planA = await createPlan(tenant.id, 'A_1', 'Plan A 1')
    await createPlan(tenant.id, 'A_2', 'Plan A 2')

    const response = await client
      .patch(`/api/plans/${planA.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ code: 'A_2' })
      .loginAs(superadminUser)

    response.assertStatus(409)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Ya existe un plan con ese código en este gym' }],
    })
  })

  test('actualizar plan sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const plan = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .patch(`/api/plans/${plan.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .json({ name: 'No' })

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})

test.group('Plans / Destroy - soft delete y tenant', (group) => {
  group.each.setup(setupDb)

  test('borrar plan ADMIN puede borrar su plan -> 200', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)

    const adminUser = await UserFactory.merge({
      tenantId: tenant.id,
      roleId: adminRole.id,
    }).create()

    const plan = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .delete(`/api/plans/${plan.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(200)
    const body = response.body()! as Response
    assert.equal(body.message, 'Plan dado de baja correctamente')

    const deleted = await MembershipPlan.query().where('id', plan.id).first()
    assert.isNotNull(deleted?.deletedAt)
  })

  test('borrar plan normal intentando borrar plan de otro tenant -> 404', async ({
    client,
    assert,
  }) => {
    const tenantA = await TenantFactory.create()
    const tenantB = await TenantFactory.create()

    const adminRole = await Role.findByOrFail('code', RoleCode.ADMIN)
    const adminUser = await UserFactory.merge({
      tenantId: tenantA.id,
      roleId: adminRole.id,
    }).create()

    const planInB = await createPlan(tenantB.id, 'B_1', 'Plan B 1')

    const response = await client
      .delete(`/api/plans/${planInB.id}`)
      .header('X-Tenant-Slug', `${tenantA.slug}.localhost:3333`)
      .loginAs(adminUser)

    response.assertStatus(404)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, { errors: [{ message: 'Plan no encontrado' }] })
  })

  test('borrar plan sin autenticación -> 401', async ({ client, assert }) => {
    const tenant = await TenantFactory.create()
    const plan = await createPlan(tenant.id, 'A_1', 'Plan A 1')

    const response = await client
      .delete(`/api/plans/${plan.id}`)
      .header('X-Tenant-Slug', `${tenant.slug}.localhost:3333`)

    response.assertStatus(401)
    const body = response.body()! as ResponseError
    assert.deepEqual(body, {
      errors: [{ message: 'Debes iniciar sesión para acceder a esta sección' }],
    })
  })
})
