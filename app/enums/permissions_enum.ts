// app/enums/permissions.ts

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
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',
  CLIENTS_READ = 'clients:read',
  CLIENTS_WRITE = 'clients:write',
  CLIENTS_DELETE = 'clients:delete',
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_WRITE = 'payments:write',
  PLANS_MANAGE = 'plans:manage',
  ATTENDANCE_CHECKIN = 'attendance:checkin',
  BRANCH_MANAGE = 'branch:manage',
  CLASSES_MANAGE = 'classes:manage',
  TRAINERS_MANAGE = 'trainers:manage',
  ROUTINES_MANAGE = 'routines:manage',
  CATALOG_MANAGE = 'catalog:manage',
  SETTINGS_MANAGE = 'settings:manage',
  AUDIT_VIEW = 'audit:view',
}
