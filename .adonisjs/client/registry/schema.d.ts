/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'admin.list_tenants.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/tenants'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/list_tenants_controller').default['index']>>>
    }
  }
  'admin.create_tenant.store': {
    methods: ["POST"]
    pattern: '/api/admin/tenants'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/tenant').createTenantValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/tenant').createTenantValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/create_tenant_controller').default['store']>>>
    }
  }
  'admin.update_tenant.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/tenants/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/tenant').updateTenantValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/tenant').updateTenantValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/update_tenant_controller').default['update']>>>
    }
  }
  'admin.destroy_tenant.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/tenants/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/destroy_tenant_controller').default['destroy']>>>
    }
  }
  'users.list_users.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/user').tenantIdQueryValidator)>|InferInput<(typeof import('#validators/user').listUsersQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/list_users_controller').default['index']>>>
    }
  }
  'users.create_user.store': {
    methods: ["POST"]
    pattern: '/api/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/create_user_controller').default['store']>>>
    }
  }
  'users.show_user.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/show_user_controller').default['show']>>>
    }
  }
  'users.update_user.update': {
    methods: ["PATCH"]
    pattern: '/api/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/update_user_controller').default['update']>>>
    }
  }
  'users.destroy_user.destroy': {
    methods: ["DELETE"]
    pattern: '/api/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/destroy_user_controller').default['destroy']>>>
    }
  }
  'clients.list_clients.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/clients'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/client').tenantIdQueryValidator)>|InferInput<(typeof import('#validators/client').listClientsQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/client/list_clients_controller').default['index']>>>
    }
  }
  'clients.create_client.store': {
    methods: ["POST"]
    pattern: '/api/clients'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/client').createClientValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/client').createClientValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/client/create_client_controller').default['store']>>>
    }
  }
  'clients.show_client.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/clients/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/client/show_client_controller').default['show']>>>
    }
  }
  'clients.update_client.update': {
    methods: ["PATCH"]
    pattern: '/api/clients/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/client').updateClientValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/client').updateClientValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/client/update_client_controller').default['update']>>>
    }
  }
  'clients.destroy_client.destroy': {
    methods: ["DELETE"]
    pattern: '/api/clients/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/client/destroy_client_controller').default['destroy']>>>
    }
  }
  'plans.list_plans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/plans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/plan').tenantIdQueryValidator)>|InferInput<(typeof import('#validators/plan').listPlansQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/plan/list_plans_controller').default['index']>>>
    }
  }
  'plans.create_plan.store': {
    methods: ["POST"]
    pattern: '/api/plans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/plan').createPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/plan').createPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/plan/create_plan_controller').default['store']>>>
    }
  }
  'plans.show_plan.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/plans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/plan/show_plan_controller').default['show']>>>
    }
  }
  'plans.update_plan.update': {
    methods: ["PATCH"]
    pattern: '/api/plans/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/plan').updatePlanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/plan').updatePlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/plan/update_plan_controller').default['update']>>>
    }
  }
  'plans.destroy_plan.destroy': {
    methods: ["DELETE"]
    pattern: '/api/plans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/plan/destroy_plan_controller').default['destroy']>>>
    }
  }
  'memberships.list_memberships.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/memberships'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/membership').tenantIdQueryValidator)>|InferInput<(typeof import('#validators/membership').listMembershipsQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/membership/list_memberships_controller').default['index']>>>
    }
  }
  'memberships.create_membership.store': {
    methods: ["POST"]
    pattern: '/api/memberships'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/membership').createMembershipValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/membership').createMembershipValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/membership/create_membership_controller').default['store']>>>
    }
  }
  'memberships.show_membership.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/memberships/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/membership/show_membership_controller').default['show']>>>
    }
  }
  'memberships.update_membership.update': {
    methods: ["PATCH"]
    pattern: '/api/memberships/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/membership').updateMembershipValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/membership').updateMembershipValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/membership/update_membership_controller').default['update']>>>
    }
  }
  'memberships.destroy_membership.destroy': {
    methods: ["DELETE"]
    pattern: '/api/memberships/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/membership/destroy_membership_controller').default['destroy']>>>
    }
  }
  'payments.list_payments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/payment').tenantIdQueryValidator)>|InferInput<(typeof import('#validators/payment').listPaymentsQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment/list_payments_controller').default['index']>>>
    }
  }
  'payments.create_payment.store': {
    methods: ["POST"]
    pattern: '/api/payments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/payment').createPaymentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/payment').createPaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment/create_payment_controller').default['store']>>>
    }
  }
  'payments.show_payment.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/payments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment/show_payment_controller').default['show']>>>
    }
  }
  'payments.update_payment.update': {
    methods: ["PATCH"]
    pattern: '/api/payments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/payment').updatePaymentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/payment').updatePaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment/update_payment_controller').default['update']>>>
    }
  }
  'payments.cancel_payment.cancel': {
    methods: ["POST"]
    pattern: '/api/payments/:id/cancel'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/payment').cancelPaymentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/payment').cancelPaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment/cancel_payment_controller').default['cancel']>>>
    }
  }
  'attendances.list_attendances.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/attendances'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/attendance').tenantIdQueryValidator)>|InferInput<(typeof import('#validators/attendance').listAttendancesQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/list_attendances_controller').default['index']>>>
    }
  }
  'attendances.create_attendance.store': {
    methods: ["POST"]
    pattern: '/api/attendances'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/attendance').createAttendanceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/attendance').createAttendanceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/create_attendance_controller').default['store']>>>
    }
  }
  'attendances.show_attendance.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/attendances/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/show_attendance_controller').default['show']>>>
    }
  }
  'attendances.update_attendance.update': {
    methods: ["PATCH"]
    pattern: '/api/attendances/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/attendance').updateAttendanceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/attendance').updateAttendanceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/update_attendance_controller').default['update']>>>
    }
  }
  'attendances.destroy_attendance.destroy': {
    methods: ["DELETE"]
    pattern: '/api/attendances/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/destroy_attendance_controller').default['destroy']>>>
    }
  }
  'attendances.checkin_attendance.checkin': {
    methods: ["POST"]
    pattern: '/api/attendances/checkin'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/attendance').checkInValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/attendance').checkInValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/checkin_attendance_controller').default['checkin']>>>
    }
  }
  'attendances.checkout_attendance.checkout': {
    methods: ["POST"]
    pattern: '/api/attendances/:id/checkout'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/attendance').checkOutValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/attendance').checkOutValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/attendance/checkout_attendance_controller').default['checkout']>>>
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/access_token_controller').default['store']>>>
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/access_token_controller').default['destroy']>>>
    }
  }
  'access_token.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/tenant-config'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/access_token_controller').default['index']>>>
    }
  }
  'access_token.filter': {
    methods: ["GET","HEAD"]
    pattern: '/api/permissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/access_token_controller').default['filter']>>>
    }
  }
  'catalogs_role.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/catalog-roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/catalog/catalogs_role_controller').default['index']>>>
    }
  }
}
