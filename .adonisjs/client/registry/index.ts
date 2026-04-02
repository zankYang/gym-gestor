/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'admin.list_tenants.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/tenants',
    tokens: [{"old":"/api/admin/tenants","type":0,"val":"api","end":""},{"old":"/api/admin/tenants","type":0,"val":"admin","end":""},{"old":"/api/admin/tenants","type":0,"val":"tenants","end":""}],
    types: placeholder as Registry['admin.list_tenants.index']['types'],
  },
  'admin.create_tenant.store': {
    methods: ["POST"],
    pattern: '/api/admin/tenants',
    tokens: [{"old":"/api/admin/tenants","type":0,"val":"api","end":""},{"old":"/api/admin/tenants","type":0,"val":"admin","end":""},{"old":"/api/admin/tenants","type":0,"val":"tenants","end":""}],
    types: placeholder as Registry['admin.create_tenant.store']['types'],
  },
  'admin.update_tenant.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/tenants/:id',
    tokens: [{"old":"/api/admin/tenants/:id","type":0,"val":"api","end":""},{"old":"/api/admin/tenants/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/tenants/:id","type":0,"val":"tenants","end":""},{"old":"/api/admin/tenants/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.update_tenant.update']['types'],
  },
  'admin.destroy_tenant.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/tenants/:id',
    tokens: [{"old":"/api/admin/tenants/:id","type":0,"val":"api","end":""},{"old":"/api/admin/tenants/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/tenants/:id","type":0,"val":"tenants","end":""},{"old":"/api/admin/tenants/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.destroy_tenant.destroy']['types'],
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
  'clients.list_clients.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/clients',
    tokens: [{"old":"/api/clients","type":0,"val":"api","end":""},{"old":"/api/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.list_clients.index']['types'],
  },
  'clients.create_client.store': {
    methods: ["POST"],
    pattern: '/api/clients',
    tokens: [{"old":"/api/clients","type":0,"val":"api","end":""},{"old":"/api/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.create_client.store']['types'],
  },
  'clients.show_client.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/clients/:id',
    tokens: [{"old":"/api/clients/:id","type":0,"val":"api","end":""},{"old":"/api/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.show_client.show']['types'],
  },
  'clients.update_client.update': {
    methods: ["PATCH"],
    pattern: '/api/clients/:id',
    tokens: [{"old":"/api/clients/:id","type":0,"val":"api","end":""},{"old":"/api/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.update_client.update']['types'],
  },
  'clients.destroy_client.destroy': {
    methods: ["DELETE"],
    pattern: '/api/clients/:id',
    tokens: [{"old":"/api/clients/:id","type":0,"val":"api","end":""},{"old":"/api/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.destroy_client.destroy']['types'],
  },
  'plans.list_plans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/plans',
    tokens: [{"old":"/api/plans","type":0,"val":"api","end":""},{"old":"/api/plans","type":0,"val":"plans","end":""}],
    types: placeholder as Registry['plans.list_plans.index']['types'],
  },
  'plans.create_plan.store': {
    methods: ["POST"],
    pattern: '/api/plans',
    tokens: [{"old":"/api/plans","type":0,"val":"api","end":""},{"old":"/api/plans","type":0,"val":"plans","end":""}],
    types: placeholder as Registry['plans.create_plan.store']['types'],
  },
  'plans.show_plan.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/plans/:id',
    tokens: [{"old":"/api/plans/:id","type":0,"val":"api","end":""},{"old":"/api/plans/:id","type":0,"val":"plans","end":""},{"old":"/api/plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['plans.show_plan.show']['types'],
  },
  'plans.update_plan.update': {
    methods: ["PATCH"],
    pattern: '/api/plans/:id',
    tokens: [{"old":"/api/plans/:id","type":0,"val":"api","end":""},{"old":"/api/plans/:id","type":0,"val":"plans","end":""},{"old":"/api/plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['plans.update_plan.update']['types'],
  },
  'plans.destroy_plan.destroy': {
    methods: ["DELETE"],
    pattern: '/api/plans/:id',
    tokens: [{"old":"/api/plans/:id","type":0,"val":"api","end":""},{"old":"/api/plans/:id","type":0,"val":"plans","end":""},{"old":"/api/plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['plans.destroy_plan.destroy']['types'],
  },
  'memberships.list_memberships.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/memberships',
    tokens: [{"old":"/api/memberships","type":0,"val":"api","end":""},{"old":"/api/memberships","type":0,"val":"memberships","end":""}],
    types: placeholder as Registry['memberships.list_memberships.index']['types'],
  },
  'memberships.create_membership.store': {
    methods: ["POST"],
    pattern: '/api/memberships',
    tokens: [{"old":"/api/memberships","type":0,"val":"api","end":""},{"old":"/api/memberships","type":0,"val":"memberships","end":""}],
    types: placeholder as Registry['memberships.create_membership.store']['types'],
  },
  'memberships.show_membership.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/memberships/:id',
    tokens: [{"old":"/api/memberships/:id","type":0,"val":"api","end":""},{"old":"/api/memberships/:id","type":0,"val":"memberships","end":""},{"old":"/api/memberships/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['memberships.show_membership.show']['types'],
  },
  'memberships.update_membership.update': {
    methods: ["PATCH"],
    pattern: '/api/memberships/:id',
    tokens: [{"old":"/api/memberships/:id","type":0,"val":"api","end":""},{"old":"/api/memberships/:id","type":0,"val":"memberships","end":""},{"old":"/api/memberships/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['memberships.update_membership.update']['types'],
  },
  'memberships.destroy_membership.destroy': {
    methods: ["DELETE"],
    pattern: '/api/memberships/:id',
    tokens: [{"old":"/api/memberships/:id","type":0,"val":"api","end":""},{"old":"/api/memberships/:id","type":0,"val":"memberships","end":""},{"old":"/api/memberships/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['memberships.destroy_membership.destroy']['types'],
  },
  'payments.list_payments.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/payments',
    tokens: [{"old":"/api/payments","type":0,"val":"api","end":""},{"old":"/api/payments","type":0,"val":"payments","end":""}],
    types: placeholder as Registry['payments.list_payments.index']['types'],
  },
  'payments.create_payment.store': {
    methods: ["POST"],
    pattern: '/api/payments',
    tokens: [{"old":"/api/payments","type":0,"val":"api","end":""},{"old":"/api/payments","type":0,"val":"payments","end":""}],
    types: placeholder as Registry['payments.create_payment.store']['types'],
  },
  'payments.show_payment.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/payments/:id',
    tokens: [{"old":"/api/payments/:id","type":0,"val":"api","end":""},{"old":"/api/payments/:id","type":0,"val":"payments","end":""},{"old":"/api/payments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payments.show_payment.show']['types'],
  },
  'payments.update_payment.update': {
    methods: ["PATCH"],
    pattern: '/api/payments/:id',
    tokens: [{"old":"/api/payments/:id","type":0,"val":"api","end":""},{"old":"/api/payments/:id","type":0,"val":"payments","end":""},{"old":"/api/payments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payments.update_payment.update']['types'],
  },
  'payments.cancel_payment.cancel': {
    methods: ["POST"],
    pattern: '/api/payments/:id/cancel',
    tokens: [{"old":"/api/payments/:id/cancel","type":0,"val":"api","end":""},{"old":"/api/payments/:id/cancel","type":0,"val":"payments","end":""},{"old":"/api/payments/:id/cancel","type":1,"val":"id","end":""},{"old":"/api/payments/:id/cancel","type":0,"val":"cancel","end":""}],
    types: placeholder as Registry['payments.cancel_payment.cancel']['types'],
  },
  'attendances.list_attendances.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/attendances',
    tokens: [{"old":"/api/attendances","type":0,"val":"api","end":""},{"old":"/api/attendances","type":0,"val":"attendances","end":""}],
    types: placeholder as Registry['attendances.list_attendances.index']['types'],
  },
  'attendances.create_attendance.store': {
    methods: ["POST"],
    pattern: '/api/attendances',
    tokens: [{"old":"/api/attendances","type":0,"val":"api","end":""},{"old":"/api/attendances","type":0,"val":"attendances","end":""}],
    types: placeholder as Registry['attendances.create_attendance.store']['types'],
  },
  'attendances.show_attendance.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/attendances/:id',
    tokens: [{"old":"/api/attendances/:id","type":0,"val":"api","end":""},{"old":"/api/attendances/:id","type":0,"val":"attendances","end":""},{"old":"/api/attendances/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['attendances.show_attendance.show']['types'],
  },
  'attendances.update_attendance.update': {
    methods: ["PATCH"],
    pattern: '/api/attendances/:id',
    tokens: [{"old":"/api/attendances/:id","type":0,"val":"api","end":""},{"old":"/api/attendances/:id","type":0,"val":"attendances","end":""},{"old":"/api/attendances/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['attendances.update_attendance.update']['types'],
  },
  'attendances.destroy_attendance.destroy': {
    methods: ["DELETE"],
    pattern: '/api/attendances/:id',
    tokens: [{"old":"/api/attendances/:id","type":0,"val":"api","end":""},{"old":"/api/attendances/:id","type":0,"val":"attendances","end":""},{"old":"/api/attendances/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['attendances.destroy_attendance.destroy']['types'],
  },
  'attendances.checkin_attendance.checkin': {
    methods: ["POST"],
    pattern: '/api/attendances/checkin',
    tokens: [{"old":"/api/attendances/checkin","type":0,"val":"api","end":""},{"old":"/api/attendances/checkin","type":0,"val":"attendances","end":""},{"old":"/api/attendances/checkin","type":0,"val":"checkin","end":""}],
    types: placeholder as Registry['attendances.checkin_attendance.checkin']['types'],
  },
  'attendances.checkout_attendance.checkout': {
    methods: ["POST"],
    pattern: '/api/attendances/:id/checkout',
    tokens: [{"old":"/api/attendances/:id/checkout","type":0,"val":"api","end":""},{"old":"/api/attendances/:id/checkout","type":0,"val":"attendances","end":""},{"old":"/api/attendances/:id/checkout","type":1,"val":"id","end":""},{"old":"/api/attendances/:id/checkout","type":0,"val":"checkout","end":""}],
    types: placeholder as Registry['attendances.checkout_attendance.checkout']['types'],
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
  'access_token.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/tenant-config',
    tokens: [{"old":"/api/tenant-config","type":0,"val":"api","end":""},{"old":"/api/tenant-config","type":0,"val":"tenant-config","end":""}],
    types: placeholder as Registry['access_token.index']['types'],
  },
  'access_token.filter': {
    methods: ["GET","HEAD"],
    pattern: '/api/permissions',
    tokens: [{"old":"/api/permissions","type":0,"val":"api","end":""},{"old":"/api/permissions","type":0,"val":"permissions","end":""}],
    types: placeholder as Registry['access_token.filter']['types'],
  },
  'catalogs_role.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/catalog-roles',
    tokens: [{"old":"/api/catalog-roles","type":0,"val":"api","end":""},{"old":"/api/catalog-roles","type":0,"val":"catalog-roles","end":""}],
    types: placeholder as Registry['catalogs_role.index']['types'],
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
