/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  admin: {
    listTenants: {
      index: typeof routes['admin.list_tenants.index']
    }
    createTenant: {
      store: typeof routes['admin.create_tenant.store']
    }
    updateTenant: {
      update: typeof routes['admin.update_tenant.update']
    }
    destroyTenant: {
      destroy: typeof routes['admin.destroy_tenant.destroy']
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
  clients: {
    listClients: {
      index: typeof routes['clients.list_clients.index']
    }
    createClient: {
      store: typeof routes['clients.create_client.store']
    }
    showClient: {
      show: typeof routes['clients.show_client.show']
    }
    updateClient: {
      update: typeof routes['clients.update_client.update']
    }
    destroyClient: {
      destroy: typeof routes['clients.destroy_client.destroy']
    }
  }
  plans: {
    listPlans: {
      index: typeof routes['plans.list_plans.index']
    }
    createPlan: {
      store: typeof routes['plans.create_plan.store']
    }
    showPlan: {
      show: typeof routes['plans.show_plan.show']
    }
    updatePlan: {
      update: typeof routes['plans.update_plan.update']
    }
    destroyPlan: {
      destroy: typeof routes['plans.destroy_plan.destroy']
    }
  }
  memberships: {
    listMemberships: {
      index: typeof routes['memberships.list_memberships.index']
    }
    createMembership: {
      store: typeof routes['memberships.create_membership.store']
    }
    showMembership: {
      show: typeof routes['memberships.show_membership.show']
    }
    updateMembership: {
      update: typeof routes['memberships.update_membership.update']
    }
    destroyMembership: {
      destroy: typeof routes['memberships.destroy_membership.destroy']
    }
  }
  payments: {
    listPayments: {
      index: typeof routes['payments.list_payments.index']
    }
    createPayment: {
      store: typeof routes['payments.create_payment.store']
    }
    showPayment: {
      show: typeof routes['payments.show_payment.show']
    }
    updatePayment: {
      update: typeof routes['payments.update_payment.update']
    }
    cancelPayment: {
      cancel: typeof routes['payments.cancel_payment.cancel']
    }
  }
  attendances: {
    listAttendances: {
      index: typeof routes['attendances.list_attendances.index']
    }
    createAttendance: {
      store: typeof routes['attendances.create_attendance.store']
    }
    showAttendance: {
      show: typeof routes['attendances.show_attendance.show']
    }
    updateAttendance: {
      update: typeof routes['attendances.update_attendance.update']
    }
    destroyAttendance: {
      destroy: typeof routes['attendances.destroy_attendance.destroy']
    }
    checkinAttendance: {
      checkin: typeof routes['attendances.checkin_attendance.checkin']
    }
    checkoutAttendance: {
      checkout: typeof routes['attendances.checkout_attendance.checkout']
    }
  }
  auth: {
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  accessToken: {
    index: typeof routes['access_token.index']
    filter: typeof routes['access_token.filter']
  }
  catalogsRole: {
    index: typeof routes['catalogs_role.index']
  }
}
