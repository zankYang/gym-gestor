export enum PermissionModule {
  AUTH = 'auth',
  CLIENTS = 'clients',
  FINANCE = 'finance',
  OPERATIONS = 'operations',
  FITNESS = 'fitness',
  WORKOUT = 'workout',
  SYSTEM = 'system',
}

export enum PermissionCode {
  // auth
  USERS_READ = 'users:read',
  USERS_WRITE = 'users:write',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE = 'users:manage',
  USERS_VIEW = 'users:view',
  ROLES_MANAGE = 'roles:manage',
  ROLES_VIEW = 'roles:view',

  // clients
  CLIENTS_READ = 'clients:read',
  CLIENTS_WRITE = 'clients:write',
  CLIENTS_VIEW = 'clients:view',
  CLIENTS_DELETE = 'clients:delete',
  MEMBERSHIPS_MANAGE = 'memberships:manage',
  MEMBERSHIPS_VIEW = 'memberships:view',

  // finance
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_WRITE = 'payments:write',
  PAYMENTS_CANCEL = 'payments:cancel',
  PAYMENTS_VIEW = 'payments:view',
  PLANS_MANAGE = 'plans:manage',
  PLANS_VIEW = 'plans:view',

  // operations
  ATTENDANCE_CHECKIN = 'attendance:checkin',
  ATTENDANCES_MANAGE = 'attendances:manage',
  ATTENDANCES_CHECKOUT = 'attendances:checkout',
  ATTENDANCES_DELETE = 'attendances:delete',
  ATTENDANCES_VIEW = 'attendances:view',
  BRANCH_MANAGE = 'branch:manage',
  BRANCH_VIEW = 'branch:view',

  // fitness
  CLASSES_MANAGE = 'classes:manage',
  CLASSES_VIEW = 'classes:view',
  TRAINERS_MANAGE = 'trainers:manage',
  TRAINERS_VIEW = 'trainers:view',

  // workout
  ROUTINES_MANAGE = 'routines:manage',
  ROUTINES_VIEW = 'routines:view',
  CATALOG_MANAGE = 'catalog:manage',

  // system
  SETTINGS_MANAGE = 'settings:manage',
  AUDIT_VIEW = 'audit:view',
  REPORTS_VIEW = 'reports:view',
  DOCUMENTS_MANAGE = 'documents:manage',
  NOTIFICATIONS_MANAGE = 'notifications:manage',
  // tenants
  TENANTS_READ = 'tenants:read',
  TENANTS_WRITE = 'tenants:write',
  TENANTS_DELETE = 'tenants:delete',
  TENANTS_VIEW = 'tenants:view',
}
