# Sentido de cada grupo de endpoints

Este documento explica para que existe cada grupo de endpoints de la API y que responsabilidad tiene dentro del sistema.

## Vista general

La API esta organizada por dominios funcionales. Cada grupo busca separar responsabilidades para que:

- sea mas facil mantener permisos por area;
- la logica de negocio quede encapsulada por contexto;
- frontend y backend hablen el mismo lenguaje de producto.

## Grupo raiz (`/`)

- **Endpoint:** `GET /`
- **Sentido:** health check basico del servidor.
- **Uso comun:** verificar que la app esta levantada.

## Grupo de autenticacion (`/api/auth`)

- **Endpoints principales:** login y logout.
- **Sentido:** gestionar la sesion/token del usuario.
- **Responsabilidad:** validar credenciales, emitir token y cerrar sesion.
- **Nota:** no deberia contener logica de negocio de otros modulos.

## Grupo de configuracion y catalogos (`/api/tenant-config`, `/api/permissions`, `/api/catalog-roles`)

- **Sentido:** entregar informacion base para inicializar la app cliente.
- **Responsabilidad:**
  - resolver tenant actual;
  - devolver permisos efectivos del usuario;
  - exponer catalogos necesarios para pantallas (por ejemplo roles).
- **Valor:** evita hardcodear datos de contexto en frontend.

## Grupo admin de tenants (`/api/admin/tenants`)

- **Sentido:** administracion global de gimnasios (multi-tenant).
- **Responsabilidad:** alta, listado, edicion y baja logica de tenants.
- **Perfil objetivo:** superadmin.
- **Valor:** separa operacion global de la operacion diaria de cada gym.

## Grupo usuarios (`/api/users`)

- **Sentido:** gestion de cuentas internas del gimnasio.
- **Responsabilidad:** CRUD de usuarios y asignacion de rol/estado.
- **Enfoque:** seguridad y control de acceso por permisos.
- **Resultado esperado:** definir quien puede operar cada modulo.

## Grupo clientes (`/api/clients`)

- **Sentido:** gestion del socio/cliente del gimnasio.
- **Responsabilidad:** CRUD de datos personales y estado del cliente.
- **Valor de negocio:** base del ciclo comercial y operativo del gym.

## Grupo planes (`/api/plans`)

- **Sentido:** administrar el catalogo comercial de membresias.
- **Responsabilidad:** crear y mantener planes (precio, duracion, reglas).
- **Valor:** fuente de verdad para ventas y renovaciones.

## Grupo membresias (`/api/memberships`)

- **Sentido:** representar la relacion activa entre cliente y plan contratado.
- **Responsabilidad:** alta, consulta, actualizacion y baja logica de membresias.
- **Valor de negocio:** controlar vigencia, estado y condiciones del servicio.

## Grupo cobros (`/api/payments`)

- **Sentido:** registrar y auditar movimientos de cobro del cliente.
- **Responsabilidad:**
  - listar y consultar cobros;
  - crear y actualizar transacciones;
  - cancelar/reembolsar con trazabilidad.
- **Valor de negocio:** control financiero y soporte de auditoria.

## Grupo asistencias (`/api/attendances`)

- **Sentido:** controlar la presencia operativa del socio en sede.
- **Responsabilidad:**
  - registrar check-in/check-out;
  - permitir ajustes manuales auditables;
  - consultar historial de asistencia con filtros.
- **Valor de negocio:** control de acceso, métricas de uso y trazabilidad diaria.

## Criterio de diseno recomendado para nuevos grupos

Cuando agregues un grupo de endpoints nuevo, procura que cumpla estos puntos:

- **Una responsabilidad principal:** evitar mezclar contextos distintos.
- **Permisos claros:** mapear acciones a permisos especificos.
- **Mensajes y contratos consistentes:** misma forma de respuestas y errores.
- **Aislamiento por tenant:** nunca romper reglas multi-tenant.
- **Documentacion y tests desde el inicio:** mantener calidad y trazabilidad.
