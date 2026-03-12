import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

const permissions = [
  // Módulo: users
  {
    name: 'Ver usuarios',
    code: 'users.view',
    module: 'users',
    description: 'Ver listado de usuarios',
  },
  {
    name: 'Crear usuario',
    code: 'users.create',
    module: 'users',
    description: 'Crear nuevos usuarios',
  },
  {
    name: 'Editar usuario',
    code: 'users.edit',
    module: 'users',
    description: 'Editar usuarios existentes',
  },
  {
    name: 'Eliminar usuario',
    code: 'users.delete',
    module: 'users',
    description: 'Eliminar usuarios',
  },

  // Módulo: clients
  {
    name: 'Ver clientes',
    code: 'clients.view',
    module: 'clients',
    description: 'Ver listado de clientes',
  },
  {
    name: 'Crear cliente',
    code: 'clients.create',
    module: 'clients',
    description: 'Crear nuevos clientes',
  },
  {
    name: 'Editar cliente',
    code: 'clients.edit',
    module: 'clients',
    description: 'Editar clientes existentes',
  },
  {
    name: 'Eliminar cliente',
    code: 'clients.delete',
    module: 'clients',
    description: 'Eliminar clientes',
  },

  // Módulo: memberships
  {
    name: 'Ver membresías',
    code: 'memberships.view',
    module: 'memberships',
    description: 'Ver membresías de clientes',
  },
  {
    name: 'Crear membresía',
    code: 'memberships.create',
    module: 'memberships',
    description: 'Asignar membresías a clientes',
  },
  {
    name: 'Editar membresía',
    code: 'memberships.edit',
    module: 'memberships',
    description: 'Modificar membresías activas',
  },
  {
    name: 'Cancelar membresía',
    code: 'memberships.cancel',
    module: 'memberships',
    description: 'Cancelar membresías',
  },

  // Módulo: membership_plans
  {
    name: 'Ver planes',
    code: 'membership_plans.view',
    module: 'membership_plans',
    description: 'Ver planes de membresía',
  },
  {
    name: 'Crear plan',
    code: 'membership_plans.create',
    module: 'membership_plans',
    description: 'Crear planes de membresía',
  },
  {
    name: 'Editar plan',
    code: 'membership_plans.edit',
    module: 'membership_plans',
    description: 'Editar planes de membresía',
  },
  {
    name: 'Eliminar plan',
    code: 'membership_plans.delete',
    module: 'membership_plans',
    description: 'Eliminar planes de membresía',
  },

  // Módulo: payments
  {
    name: 'Ver pagos',
    code: 'payments.view',
    module: 'payments',
    description: 'Ver historial de pagos',
  },
  {
    name: 'Registrar pago',
    code: 'payments.create',
    module: 'payments',
    description: 'Registrar nuevos pagos',
  },
  {
    name: 'Anular pago',
    code: 'payments.cancel',
    module: 'payments',
    description: 'Anular pagos registrados',
  },

  // Módulo: attendances
  {
    name: 'Ver asistencias',
    code: 'attendances.view',
    module: 'attendances',
    description: 'Ver registro de asistencias',
  },
  {
    name: 'Registrar asistencia',
    code: 'attendances.create',
    module: 'attendances',
    description: 'Registrar entrada/salida de clientes',
  },

  // Módulo: trainers
  {
    name: 'Ver entrenadores',
    code: 'trainers.view',
    module: 'trainers',
    description: 'Ver listado de entrenadores',
  },
  {
    name: 'Crear entrenador',
    code: 'trainers.create',
    module: 'trainers',
    description: 'Registrar nuevos entrenadores',
  },
  {
    name: 'Editar entrenador',
    code: 'trainers.edit',
    module: 'trainers',
    description: 'Editar datos de entrenadores',
  },
  {
    name: 'Eliminar entrenador',
    code: 'trainers.delete',
    module: 'trainers',
    description: 'Eliminar entrenadores',
  },

  // Módulo: routines
  {
    name: 'Ver rutinas',
    code: 'routines.view',
    module: 'routines',
    description: 'Ver rutinas de clientes',
  },
  {
    name: 'Crear rutina',
    code: 'routines.create',
    module: 'routines',
    description: 'Crear rutinas para clientes',
  },
  {
    name: 'Editar rutina',
    code: 'routines.edit',
    module: 'routines',
    description: 'Editar rutinas existentes',
  },
  {
    name: 'Eliminar rutina',
    code: 'routines.delete',
    module: 'routines',
    description: 'Eliminar rutinas',
  },

  // Módulo: classes
  {
    name: 'Ver clases',
    code: 'classes.view',
    module: 'classes',
    description: 'Ver clases grupales',
  },
  {
    name: 'Crear clase',
    code: 'classes.create',
    module: 'classes',
    description: 'Crear nuevas clases grupales',
  },
  {
    name: 'Editar clase',
    code: 'classes.edit',
    module: 'classes',
    description: 'Editar clases grupales',
  },
  {
    name: 'Eliminar clase',
    code: 'classes.delete',
    module: 'classes',
    description: 'Eliminar clases grupales',
  },
  {
    name: 'Gestionar reservas',
    code: 'classes.reservations',
    module: 'classes',
    description: 'Gestionar reservas de clases',
  },

  // Módulo: branches
  {
    name: 'Ver sucursales',
    code: 'branches.view',
    module: 'branches',
    description: 'Ver sucursales del gimnasio',
  },
  {
    name: 'Crear sucursal',
    code: 'branches.create',
    module: 'branches',
    description: 'Crear nuevas sucursales',
  },
  {
    name: 'Editar sucursal',
    code: 'branches.edit',
    module: 'branches',
    description: 'Editar sucursales',
  },

  // Módulo: reports
  {
    name: 'Ver reportes',
    code: 'reports.view',
    module: 'reports',
    description: 'Acceder a reportes y estadísticas',
  },
  {
    name: 'Exportar reportes',
    code: 'reports.export',
    module: 'reports',
    description: 'Exportar reportes',
  },

  // Módulo: settings
  {
    name: 'Ver configuración',
    code: 'settings.view',
    module: 'settings',
    description: 'Ver configuración del sistema',
  },
  {
    name: 'Editar configuración',
    code: 'settings.edit',
    module: 'settings',
    description: 'Modificar configuración del sistema',
  },

  // Módulo: documents
  {
    name: 'Ver documentos',
    code: 'documents.view',
    module: 'documents',
    description: 'Ver documentos',
  },
  {
    name: 'Subir documento',
    code: 'documents.create',
    module: 'documents',
    description: 'Subir documentos',
  },
  {
    name: 'Aprobar documento',
    code: 'documents.approve',
    module: 'documents',
    description: 'Aprobar documentos pendientes',
  },
]

export default class PermissionSeeder extends BaseSeeder {
  async run() {
    for (const permission of permissions) {
      await Permission.firstOrCreate({ code: permission.code }, permission)
    }
  }
}
