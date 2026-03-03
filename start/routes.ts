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
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
        router.get('testing', [controllers.Testing, 'show'])
      })
      .prefix('/auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('/account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api')
