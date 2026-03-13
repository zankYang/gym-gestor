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

router.get('/', () => {
  return { server: 'running' }
})

router
  .group(() => {
    // Admin routes
    router
      .group(() => {
        router.get('gyms', [controllers.admin.ListGyms, 'index'])
        router.post('gyms', [controllers.admin.CreateGym, 'store'])
        router.patch('gyms/:id', [controllers.admin.UpdateGym, 'update'])
        router.delete('gyms/:id', [controllers.admin.DestroyGym, 'destroy'])
      })
      .prefix('/admin')
      .as('admin')
      .use([middleware.auth(), middleware.superadmin()])

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
      .use([middleware.auth(), middleware.canManageUsers()])

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
