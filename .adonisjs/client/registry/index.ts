/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'admin.list_gyms.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/gyms',
    tokens: [{"old":"/api/admin/gyms","type":0,"val":"api","end":""},{"old":"/api/admin/gyms","type":0,"val":"admin","end":""},{"old":"/api/admin/gyms","type":0,"val":"gyms","end":""}],
    types: placeholder as Registry['admin.list_gyms.index']['types'],
  },
  'admin.create_gym.store': {
    methods: ["POST"],
    pattern: '/api/admin/gyms',
    tokens: [{"old":"/api/admin/gyms","type":0,"val":"api","end":""},{"old":"/api/admin/gyms","type":0,"val":"admin","end":""},{"old":"/api/admin/gyms","type":0,"val":"gyms","end":""}],
    types: placeholder as Registry['admin.create_gym.store']['types'],
  },
  'admin.update_gym.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/gyms/:id',
    tokens: [{"old":"/api/admin/gyms/:id","type":0,"val":"api","end":""},{"old":"/api/admin/gyms/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/gyms/:id","type":0,"val":"gyms","end":""},{"old":"/api/admin/gyms/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.update_gym.update']['types'],
  },
  'admin.destroy_gym.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/gyms/:id',
    tokens: [{"old":"/api/admin/gyms/:id","type":0,"val":"api","end":""},{"old":"/api/admin/gyms/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/gyms/:id","type":0,"val":"gyms","end":""},{"old":"/api/admin/gyms/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.destroy_gym.destroy']['types'],
  },
  'users.list_users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/users',
    tokens: [{"old":"/api/users","type":0,"val":"api","end":""},{"old":"/api/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.list_users.index']['types'],
  },
  'users.create_user.store': {
    methods: ["POST"],
    pattern: '/api/users',
    tokens: [{"old":"/api/users","type":0,"val":"api","end":""},{"old":"/api/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.create_user.store']['types'],
  },
  'users.show_user.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/users/:id',
    tokens: [{"old":"/api/users/:id","type":0,"val":"api","end":""},{"old":"/api/users/:id","type":0,"val":"users","end":""},{"old":"/api/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show_user.show']['types'],
  },
  'users.update_user.update': {
    methods: ["PATCH"],
    pattern: '/api/users/:id',
    tokens: [{"old":"/api/users/:id","type":0,"val":"api","end":""},{"old":"/api/users/:id","type":0,"val":"users","end":""},{"old":"/api/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update_user.update']['types'],
  },
  'users.destroy_user.destroy': {
    methods: ["DELETE"],
    pattern: '/api/users/:id',
    tokens: [{"old":"/api/users/:id","type":0,"val":"api","end":""},{"old":"/api/users/:id","type":0,"val":"users","end":""},{"old":"/api/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy_user.destroy']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/auth/login',
    tokens: [{"old":"/api/auth/login","type":0,"val":"api","end":""},{"old":"/api/auth/login","type":0,"val":"auth","end":""},{"old":"/api/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
