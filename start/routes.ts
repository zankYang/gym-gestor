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
        router.get('/', [controllers.user.ListUsers, 'index'])

        router.post('/', [controllers.user.CreateUser, 'store'])
        router.get('/:id', [controllers.user.ShowUser, 'show'])
        router.patch('/:id', [controllers.user.UpdateUser, 'update'])
        router.delete('/:id', [controllers.user.DestroyUser, 'destroy'])
      })
      .prefix('/users')
      .as('users')
      .use([middleware.auth()])

    // Auth routes
    router
      .group(() => {
        router.post('login', [controllers.auth.AccessToken, 'store'])
        router.post('logout', [controllers.auth.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('/auth')
      .as('auth')
  })
  .prefix('/api')
  .use([middleware.identifyTenant()])
