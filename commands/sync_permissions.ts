import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Permission from '#models/permission'
import { PermissionCode, PermissionModule } from '#enums/permissions_enum'

export default class SyncPermissions extends BaseCommand {
  static commandName = 'sync:permissions'
  static description = 'Sincroniza los permisos definidos en el Enum con la base de datos'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Iniciando sincronización de permisos...')

    const permissions = [
      // --- auth ---
      {
        code: PermissionCode.USERS_READ,
        name: 'Ver Usuarios',
        module: PermissionModule.AUTH,
        description:
          'Permite consultar el listado de usuarios del tenant y ver el detalle de cada cuenta (rol, estado, datos de acceso).',
      },
      {
        code: PermissionCode.USERS_WRITE,
        name: 'Editar Usuarios',
        module: PermissionModule.AUTH,
        description:
          'Permite crear y modificar cuentas de personal: datos personales, email y restablecer contraseñas. No incluye asignar roles.',
      },
      {
        code: PermissionCode.USERS_DELETE,
        name: 'Eliminar Usuarios',
        module: PermissionModule.AUTH,
        description:
          'Permite dar de baja o eliminar cuentas de usuarios del tenant. No aplica a superadmins ni a admins desde un rol inferior.',
      },
      {
        code: PermissionCode.USERS_MANAGE,
        name: 'Gestionar Usuarios',
        module: PermissionModule.AUTH,
        description:
          'Permite crear, editar, desactivar y eliminar cuentas de personal (recepcionistas, entrenadores, administradores). Incluye restablecer contraseñas y modificar datos de acceso.',
      },
      {
        code: PermissionCode.USERS_VIEW,
        name: 'Ver Usuarios (solo lectura)',
        module: PermissionModule.AUTH,
        description:
          'Permite consultar listado y detalle de usuarios del tenant sin poder crear, editar ni eliminar cuentas.',
      },
      {
        code: PermissionCode.ROLES_MANAGE,
        name: 'Gestionar Roles',
        module: PermissionModule.AUTH,
        description:
          'Permite asignar y cambiar el rol de cualquier usuario del tenant. Controla qué nivel de acceso tiene cada miembro del equipo dentro del sistema.',
      },
      {
        code: PermissionCode.ROLES_VIEW,
        name: 'Ver Roles',
        module: PermissionModule.AUTH,
        description:
          'Permite consultar los roles disponibles y sus permisos asociados sin poder modificarlos.',
      },

      // --- clients ---
      {
        code: PermissionCode.CLIENTS_READ,
        name: 'Ver Socios',
        module: PermissionModule.CLIENTS,
        description:
          'Permite consultar el listado completo de socios, buscar por nombre, DNI o membresía, y ver el detalle de su perfil, estado y actividad reciente.',
      },
      {
        code: PermissionCode.CLIENTS_WRITE,
        name: 'Editar Socios',
        module: PermissionModule.CLIENTS,
        description:
          'Permite registrar nuevos socios y editar sus datos personales como nombre, contacto, fecha de nacimiento, fotografía y sucursal asignada.',
      },
      {
        code: PermissionCode.CLIENTS_VIEW,
        name: 'Ver Socios (solo lectura)',
        module: PermissionModule.CLIENTS,
        description:
          'Permite consultar listado y perfil de socios sin poder crear, editar ni eliminar registros.',
      },
      {
        code: PermissionCode.CLIENTS_DELETE,
        name: 'Eliminar Socios',
        module: PermissionModule.CLIENTS,
        description:
          'Permite dar de baja definitiva a un socio del sistema, eliminando o archivando su historial. Acción irreversible que debe usarse con precaución.',
      },
      {
        code: PermissionCode.MEMBERSHIPS_MANAGE,
        name: 'Gestionar Membresías',
        module: PermissionModule.CLIENTS,
        description:
          'Permite dar de alta, renovar, pausar y cancelar membresías de socios. Incluye asignar el plan contratado, fecha de inicio y vencimiento.',
      },
      {
        code: PermissionCode.MEMBERSHIPS_VIEW,
        name: 'Ver Membresías',
        module: PermissionModule.CLIENTS,
        description:
          'Permite consultar el estado y el historial de membresías de los socios sin poder modificarlos.',
      },

      // --- finance ---
      {
        code: PermissionCode.PAYMENTS_READ,
        name: 'Ver Cobros',
        module: PermissionModule.FINANCE,
        description:
          'Permite consultar el historial completo de pagos del gimnasio: fecha, monto, método de pago, socio relacionado y estado del cobro.',
      },
      {
        code: PermissionCode.PAYMENTS_WRITE,
        name: 'Registrar Cobros',
        module: PermissionModule.FINANCE,
        description:
          'Permite registrar nuevos pagos de mensualidades y otros conceptos. Incluye seleccionar método de pago (efectivo, transferencia, tarjeta) y emitir comprobante.',
      },
      {
        code: PermissionCode.PAYMENTS_CANCEL,
        name: 'Anular Pago',
        module: PermissionModule.FINANCE,
        description:
          'Permite anular o revertir un cobro ya registrado, dejando constancia del motivo. Genera el ajuste contable correspondiente en el historial del socio.',
      },
      {
        code: PermissionCode.PAYMENTS_VIEW,
        name: 'Ver Cobros (solo lectura)',
        module: PermissionModule.FINANCE,
        description:
          'Permite consultar pagos e historial de cobros sin poder registrar ni anular movimientos.',
      },
      {
        code: PermissionCode.PLANS_MANAGE,
        name: 'Gestionar Planes',
        module: PermissionModule.FINANCE,
        description:
          'Permite crear, editar y desactivar los planes de membresía disponibles: nombre, precio, duración, beneficios incluidos y si admite congelamiento.',
      },
      {
        code: PermissionCode.PLANS_VIEW,
        name: 'Ver Planes',
        module: PermissionModule.FINANCE,
        description:
          'Permite consultar el catálogo de planes de membresía (precios, duración y beneficios) sin poder crearlos ni modificarlos.',
      },

      // --- operations ---
      {
        code: PermissionCode.ATTENDANCE_CHECKIN,
        name: 'Check-in Asistencia',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite registrar la entrada y salida de socios en la sucursal, ya sea mediante búsqueda manual, escaneo de QR o código de membresía.',
      },
      {
        code: PermissionCode.ATTENDANCES_MANAGE,
        name: 'Gestionar Asistencias',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite crear y editar asistencias de forma manual, incluyendo ajustes operativos en registros del día.',
      },
      {
        code: PermissionCode.ATTENDANCES_CHECKOUT,
        name: 'Registrar Checkout',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite cerrar una asistencia abierta registrando la salida del socio y su trazabilidad.',
      },
      {
        code: PermissionCode.ATTENDANCES_DELETE,
        name: 'Eliminar Asistencias',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite dar de baja lógica un registro de asistencia cuando corresponda por corrección operativa.',
      },
      {
        code: PermissionCode.ATTENDANCES_VIEW,
        name: 'Ver Asistencias',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite consultar el historial de asistencias por socio, sucursal o rango de fechas. Útil para seguimiento de frecuencia y control de acceso.',
      },
      {
        code: PermissionCode.BRANCH_MANAGE,
        name: 'Gestionar Sucursales',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite crear y configurar sucursales del gimnasio: nombre, dirección, horarios de atención, capacidad máxima y personal asignado.',
      },
      {
        code: PermissionCode.BRANCH_VIEW,
        name: 'Ver Sucursales',
        module: PermissionModule.OPERATIONS,
        description:
          'Permite consultar datos de sucursales y su configuración sin poder crear ni modificarlas.',
      },

      // --- fitness ---
      {
        code: PermissionCode.CLASSES_MANAGE,
        name: 'Gestionar Clases',
        module: PermissionModule.FITNESS,
        description:
          'Permite crear y administrar clases grupales: nombre, descripción, horario, cupo máximo, entrenador a cargo y sucursal donde se imparte.',
      },
      {
        code: PermissionCode.CLASSES_VIEW,
        name: 'Ver Clases',
        module: PermissionModule.FITNESS,
        description:
          'Permite consultar horarios, cupos y detalle de clases grupales sin poder administrarlas.',
      },
      {
        code: PermissionCode.TRAINERS_MANAGE,
        name: 'Gestionar Entrenadores',
        module: PermissionModule.FITNESS,
        description:
          'Permite registrar entrenadores, asignarlos a clases o socios, y gestionar su disponibilidad horaria y especialidades dentro del gimnasio.',
      },
      {
        code: PermissionCode.TRAINERS_VIEW,
        name: 'Ver Entrenadores',
        module: PermissionModule.FITNESS,
        description:
          'Permite consultar el listado y perfiles de entrenadores sin poder modificarlos.',
      },

      // --- workout ---
      {
        code: PermissionCode.ROUTINES_MANAGE,
        name: 'Gestionar Rutinas',
        module: PermissionModule.WORKOUT,
        description:
          'Permite crear rutinas de entrenamiento personalizadas y asignarlas a socios específicos. Incluye definir días, series, repeticiones y ejercicios del catálogo.',
      },
      {
        code: PermissionCode.ROUTINES_VIEW,
        name: 'Ver Rutinas',
        module: PermissionModule.WORKOUT,
        description:
          'Permite consultar rutinas asignadas y su contenido sin poder crear ni editarlas.',
      },
      {
        code: PermissionCode.CATALOG_MANAGE,
        name: 'Gestionar Catálogo',
        module: PermissionModule.WORKOUT,
        description:
          'Permite administrar el catálogo global de ejercicios: nombre, grupo muscular, descripción, instrucciones de ejecución e imágenes o videos de referencia.',
      },

      // --- system ---
      {
        code: PermissionCode.SETTINGS_MANAGE,
        name: 'Ajustes del Sistema',
        module: PermissionModule.SYSTEM,
        description:
          'Permite modificar la configuración global del tenant: nombre del gimnasio, logo, zona horaria, moneda, métodos de pago habilitados y parámetros generales.',
      },
      {
        code: PermissionCode.AUDIT_VIEW,
        name: 'Ver Auditoría',
        module: PermissionModule.SYSTEM,
        description:
          'Permite consultar el registro de auditoría del sistema: quién realizó cada acción, sobre qué entidad, qué valores cambió y desde qué IP o dispositivo.',
      },
      {
        code: PermissionCode.REPORTS_VIEW,
        name: 'Ver Reportes',
        module: PermissionModule.SYSTEM,
        description:
          'Permite acceder a los reportes y estadísticas del gimnasio: ingresos por período, altas y bajas de socios, asistencia promedio y rendimiento por sucursal.',
      },
      {
        code: PermissionCode.DOCUMENTS_MANAGE,
        name: 'Gestionar Documentos',
        module: PermissionModule.SYSTEM,
        description:
          'Permite subir, organizar y eliminar documentos del tenant como contratos, reglamentos, constancias y archivos adjuntos a perfiles de socios.',
      },
      {
        code: PermissionCode.NOTIFICATIONS_MANAGE,
        name: 'Gestionar Notificaciones',
        module: PermissionModule.SYSTEM,
        description:
          'Permite crear y enviar notificaciones a socios por correo o push: avisos de vencimiento, promociones, cambios de horario y comunicados generales.',
      },
      {
        code: PermissionCode.TENANTS_READ,
        name: 'Ver Tenants',
        module: PermissionModule.SYSTEM,
        description:
          'Permite listar y consultar todos los tenants (gimnasios) registrados en la plataforma: nombre, estado, plan contratado, fecha de alta y datos de contacto del propietario.',
      },
      {
        code: PermissionCode.TENANTS_WRITE,
        name: 'Editar Tenants',
        module: PermissionModule.SYSTEM,
        description:
          'Permite crear nuevos tenants en la plataforma y modificar sus datos: nombre, dominio, plan, estado (activo/suspendido) y configuración inicial del gimnasio.',
      },
      {
        code: PermissionCode.TENANTS_DELETE,
        name: 'Eliminar Tenants',
        module: PermissionModule.SYSTEM,
        description:
          'Permite dar de baja o eliminar permanentemente un tenant de la plataforma, junto con todos sus datos asociados. Acción irreversible exclusiva de superadmin.',
      },
      {
        code: PermissionCode.TENANTS_VIEW,
        name: 'Ver Tenants (solo lectura)',
        module: PermissionModule.SYSTEM,
        description:
          'Permite consultar listado y detalle de tenants sin poder crearlos, editarlos ni eliminarlos.',
      },
    ]

    try {
      await Permission.updateOrCreateMany('code', permissions)
      this.logger.success(`Sincronizados ${permissions.length} permisos exitosamente.`)
    } catch (error) {
      this.logger.error('Error al sincronizar permisos: ' + error.message)
    }
  }
}
