/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  admin: {
    listGyms: {
      index: typeof routes['admin.list_gyms.index']
    }
    createGym: {
      store: typeof routes['admin.create_gym.store']
    }
    updateGym: {
      update: typeof routes['admin.update_gym.update']
    }
    destroyGym: {
      destroy: typeof routes['admin.destroy_gym.destroy']
    }
  }
  users: {
    listUsers: {
      index: typeof routes['users.list_users.index']
    }
    createUser: {
      store: typeof routes['users.create_user.store']
    }
    showUser: {
      show: typeof routes['users.show_user.show']
    }
    updateUser: {
      update: typeof routes['users.update_user.update']
    }
    destroyUser: {
      destroy: typeof routes['users.destroy_user.destroy']
    }
  }
  auth: {
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
}
