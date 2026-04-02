/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { PermissionCode } from '#enums/permissions_enum'

router.get('/', () => {
  return { server: 'running' }
})

router
  .group(() => {
    // Admin routes
    router
      .group(() => {
        router
          .get('tenants', [controllers.admin.ListTenants, 'index'])
          .use([middleware.hasPermissions([PermissionCode.TENANTS_READ])])
        router
          .post('tenants', [controllers.admin.CreateTenant, 'store'])
          .use([middleware.hasPermissions([PermissionCode.TENANTS_WRITE])])
        router
          .patch('tenants/:id', [controllers.admin.UpdateTenant, 'update'])
          .use([middleware.hasPermissions([PermissionCode.TENANTS_WRITE])])
        router
          .delete('tenants/:id', [controllers.admin.DestroyTenant, 'destroy'])
          .use([middleware.hasPermissions([PermissionCode.TENANTS_DELETE])])
      })
      .prefix('/admin')
      .as('admin')
      .use([middleware.auth(), middleware.hasPermissions([PermissionCode.TENANTS_READ])])
    // User routes
    router
      .group(() => {
        router
          .get('/', [controllers.user.ListUsers, 'index'])
          .use([middleware.hasPermissions([PermissionCode.USERS_READ])])
        router
          .post('/', [controllers.user.CreateUser, 'store'])
          .use([middleware.hasPermissions([PermissionCode.USERS_WRITE])])
        router
          .get('/:id', [controllers.user.ShowUser, 'show'])
          .use([middleware.hasPermissions([PermissionCode.USERS_READ])])
        router
          .patch('/:id', [controllers.user.UpdateUser, 'update'])
          .use([middleware.hasPermissions([PermissionCode.USERS_WRITE])])
        router
          .delete('/:id', [controllers.user.DestroyUser, 'destroy'])
          .use([middleware.hasPermissions([PermissionCode.USERS_DELETE])])
      })
      .prefix('/users')
      .as('users')
      .use([middleware.auth(), middleware.hasPermissions([PermissionCode.USERS_MANAGE])])

    // Client routes
    router
      .group(() => {
        router
          .get('/', [controllers.client.ListClients, 'index'])
          .use([middleware.hasPermissions([PermissionCode.CLIENTS_READ])])
        router
          .post('/', [controllers.client.CreateClient, 'store'])
          .use([middleware.hasPermissions([PermissionCode.CLIENTS_WRITE])])
        router
          .get('/:id', [controllers.client.ShowClient, 'show'])
          .use([middleware.hasPermissions([PermissionCode.CLIENTS_READ])])
        router
          .patch('/:id', [controllers.client.UpdateClient, 'update'])
          .use([middleware.hasPermissions([PermissionCode.CLIENTS_WRITE])])
        router
          .delete('/:id', [controllers.client.DestroyClient, 'destroy'])
          .use([middleware.hasPermissions([PermissionCode.CLIENTS_DELETE])])
      })
      .prefix('/clients')
      .as('clients')
      .use([middleware.auth()])

    // Plan routes
    router
      .group(() => {
        router
          .get('/', [controllers.plan.ListPlans, 'index'])
          .use([middleware.hasPermissions([PermissionCode.PLANS_MANAGE])])
        router
          .post('/', [controllers.plan.CreatePlan, 'store'])
          .use([middleware.hasPermissions([PermissionCode.PLANS_MANAGE])])
        router
          .get('/:id', [controllers.plan.ShowPlan, 'show'])
          .use([middleware.hasPermissions([PermissionCode.PLANS_MANAGE])])
        router
          .patch('/:id', [controllers.plan.UpdatePlan, 'update'])
          .use([middleware.hasPermissions([PermissionCode.PLANS_MANAGE])])
        router
          .delete('/:id', [controllers.plan.DestroyPlan, 'destroy'])
          .use([middleware.hasPermissions([PermissionCode.PLANS_MANAGE])])
      })
      .prefix('/plans')
      .as('plans')
      .use([middleware.auth()])

    // Memberships (socios)
    router
      .group(() => {
        router
          .get('/', [controllers.membership.ListMemberships, 'index'])
          .use([middleware.hasPermissions([PermissionCode.MEMBERSHIPS_VIEW])])
        router
          .post('/', [controllers.membership.CreateMembership, 'store'])
          .use([middleware.hasPermissions([PermissionCode.MEMBERSHIPS_MANAGE])])
        router
          .get('/:id', [controllers.membership.ShowMembership, 'show'])
          .use([middleware.hasPermissions([PermissionCode.MEMBERSHIPS_VIEW])])
        router
          .patch('/:id', [controllers.membership.UpdateMembership, 'update'])
          .use([middleware.hasPermissions([PermissionCode.MEMBERSHIPS_MANAGE])])
        router
          .delete('/:id', [controllers.membership.DestroyMembership, 'destroy'])
          .use([middleware.hasPermissions([PermissionCode.MEMBERSHIPS_MANAGE])])
      })
      .prefix('/memberships')
      .as('memberships')
      .use([middleware.auth()])

    // Payments (cobros)
    router
      .group(() => {
        router
          .get('/', [controllers.payment.ListPayments, 'index'])
          .use([middleware.hasPermissions([PermissionCode.PAYMENTS_READ])])
        router
          .post('/', [controllers.payment.CreatePayment, 'store'])
          .use([middleware.hasPermissions([PermissionCode.PAYMENTS_WRITE])])
        router
          .get('/:id', [controllers.payment.ShowPayment, 'show'])
          .use([middleware.hasPermissions([PermissionCode.PAYMENTS_READ])])
        router
          .patch('/:id', [controllers.payment.UpdatePayment, 'update'])
          .use([middleware.hasPermissions([PermissionCode.PAYMENTS_WRITE])])
        router
          .post('/:id/cancel', [controllers.payment.CancelPayment, 'cancel'])
          .use([middleware.hasPermissions([PermissionCode.PAYMENTS_CANCEL])])
      })
      .prefix('/payments')
      .as('payments')
      .use([middleware.auth()])

    // Attendances (asistencias)
    router
      .group(() => {
        router
          .get('/', [controllers.attendance.ListAttendances, 'index'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCES_VIEW])])
        router
          .post('/', [controllers.attendance.CreateAttendance, 'store'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCES_MANAGE])])
        router
          .get('/:id', [controllers.attendance.ShowAttendance, 'show'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCES_VIEW])])
        router
          .patch('/:id', [controllers.attendance.UpdateAttendance, 'update'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCES_MANAGE])])
        router
          .delete('/:id', [controllers.attendance.DestroyAttendance, 'destroy'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCES_DELETE])])
        router
          .post('/checkin', [controllers.attendance.CheckinAttendance, 'checkin'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCE_CHECKIN])])
        router
          .post('/:id/checkout', [controllers.attendance.CheckoutAttendance, 'checkout'])
          .use([middleware.hasPermissions([PermissionCode.ATTENDANCES_CHECKOUT])])
      })
      .prefix('/attendances')
      .as('attendances')
      .use([middleware.auth()])

    // Auth routes
    router
      .group(() => {
        router.post('login', [controllers.auth.AccessToken, 'store'])
        router.post('logout', [controllers.auth.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('/auth')
      .as('auth')
    // Catalogs routes
    router.get('tenant-config', [controllers.auth.AccessToken, 'index'])
    router.get('permissions', [controllers.auth.AccessToken, 'filter']).use([middleware.auth()])
    router
      .get('catalog-roles', [controllers.auth.catalog.CatalogsRole, 'index'])
      .use([middleware.auth()])
  })
  .prefix('/api')
  .use([middleware.identifyTenant()])
