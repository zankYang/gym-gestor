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
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',

  // clients
  CLIENTS_READ = 'clients:read',
  CLIENTS_WRITE = 'clients:write',
  CLIENTS_DELETE = 'clients:delete',
  MEMBERSHIPS_MANAGE = 'memberships:manage',

  // finance
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_WRITE = 'payments:write',
  PAYMENTS_CANCEL = 'payments:cancel',
  PLANS_MANAGE = 'plans:manage',

  // operations
  ATTENDANCE_CHECKIN = 'attendance:checkin',
  ATTENDANCES_VIEW = 'attendances:view',
  BRANCH_MANAGE = 'branch:manage',

  // fitness
  CLASSES_MANAGE = 'classes:manage',
  TRAINERS_MANAGE = 'trainers:manage',

  // workout
  ROUTINES_MANAGE = 'routines:manage',
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
}
