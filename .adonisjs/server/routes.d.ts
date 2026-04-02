import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'admin.list_tenants.index': { paramsTuple?: []; params?: {} }
    'admin.create_tenant.store': { paramsTuple?: []; params?: {} }
    'admin.update_tenant.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.destroy_tenant.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.list_users.index': { paramsTuple?: []; params?: {} }
    'users.create_user.store': { paramsTuple?: []; params?: {} }
    'users.show_user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_user.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy_user.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.list_clients.index': { paramsTuple?: []; params?: {} }
    'clients.create_client.store': { paramsTuple?: []; params?: {} }
    'clients.show_client.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.update_client.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.destroy_client.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.list_plans.index': { paramsTuple?: []; params?: {} }
    'plans.create_plan.store': { paramsTuple?: []; params?: {} }
    'plans.show_plan.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.update_plan.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.destroy_plan.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.list_memberships.index': { paramsTuple?: []; params?: {} }
    'memberships.create_membership.store': { paramsTuple?: []; params?: {} }
    'memberships.show_membership.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.update_membership.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.destroy_membership.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.list_payments.index': { paramsTuple?: []; params?: {} }
    'payments.create_payment.store': { paramsTuple?: []; params?: {} }
    'payments.show_payment.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.update_payment.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.cancel_payment.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.list_attendances.index': { paramsTuple?: []; params?: {} }
    'attendances.create_attendance.store': { paramsTuple?: []; params?: {} }
    'attendances.show_attendance.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.update_attendance.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.destroy_attendance.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.checkin_attendance.checkin': { paramsTuple?: []; params?: {} }
    'attendances.checkout_attendance.checkout': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'access_token.index': { paramsTuple?: []; params?: {} }
    'access_token.filter': { paramsTuple?: []; params?: {} }
    'catalogs_role.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'admin.list_tenants.index': { paramsTuple?: []; params?: {} }
    'users.list_users.index': { paramsTuple?: []; params?: {} }
    'users.show_user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.list_clients.index': { paramsTuple?: []; params?: {} }
    'clients.show_client.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.list_plans.index': { paramsTuple?: []; params?: {} }
    'plans.show_plan.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.list_memberships.index': { paramsTuple?: []; params?: {} }
    'memberships.show_membership.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.list_payments.index': { paramsTuple?: []; params?: {} }
    'payments.show_payment.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.list_attendances.index': { paramsTuple?: []; params?: {} }
    'attendances.show_attendance.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'access_token.index': { paramsTuple?: []; params?: {} }
    'access_token.filter': { paramsTuple?: []; params?: {} }
    'catalogs_role.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'admin.list_tenants.index': { paramsTuple?: []; params?: {} }
    'users.list_users.index': { paramsTuple?: []; params?: {} }
    'users.show_user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.list_clients.index': { paramsTuple?: []; params?: {} }
    'clients.show_client.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.list_plans.index': { paramsTuple?: []; params?: {} }
    'plans.show_plan.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.list_memberships.index': { paramsTuple?: []; params?: {} }
    'memberships.show_membership.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.list_payments.index': { paramsTuple?: []; params?: {} }
    'payments.show_payment.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.list_attendances.index': { paramsTuple?: []; params?: {} }
    'attendances.show_attendance.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'access_token.index': { paramsTuple?: []; params?: {} }
    'access_token.filter': { paramsTuple?: []; params?: {} }
    'catalogs_role.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.create_tenant.store': { paramsTuple?: []; params?: {} }
    'users.create_user.store': { paramsTuple?: []; params?: {} }
    'clients.create_client.store': { paramsTuple?: []; params?: {} }
    'plans.create_plan.store': { paramsTuple?: []; params?: {} }
    'memberships.create_membership.store': { paramsTuple?: []; params?: {} }
    'payments.create_payment.store': { paramsTuple?: []; params?: {} }
    'payments.cancel_payment.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.create_attendance.store': { paramsTuple?: []; params?: {} }
    'attendances.checkin_attendance.checkin': { paramsTuple?: []; params?: {} }
    'attendances.checkout_attendance.checkout': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.update_tenant.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_user.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.update_client.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.update_plan.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.update_membership.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.update_payment.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.update_attendance.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.destroy_tenant.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy_user.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.destroy_client.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'plans.destroy_plan.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'memberships.destroy_membership.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attendances.destroy_attendance.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}