# Roles y Permisos

Documentación del sistema de control de acceso basado en roles (RBAC) de Gym Gestor.

---

## Comandos

### Configuración inicial (orden obligatorio)

```bash
# 1. Crea/actualiza los 22 permisos del enum en la base de datos
node ace sync:permissions

# 2. Crea/actualiza los roles y les asigna sus permisos base
node ace sync:roles

# 3. (Opcional) Crear el primer usuario superadmin
node ace create:superadmin --email=admin@migimnasio.com --password=micontraseña
```

> `sync:roles` depende de que los permisos ya existan en la DB. Siempre ejecutar `sync:permissions` primero.

El script `db:setup` ya ejecuta estos comandos en el orden correcto:

```bash
pnpm db:setup
# equivale a: migration:fresh → sync:permissions → sync:roles → db:seed → create:superadmin
```

### Referencia de comandos

| Comando                      | Flags                                                                         | Descripción                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `node ace sync:permissions`  | —                                                                             | Crea o actualiza los 22 permisos del enum en la base de datos                     |
| `node ace sync:roles`        | —                                                                             | Crea o actualiza los 4 roles y sincroniza sus permisos (requiere `sync:permissions` previo) |
| `node ace create:superadmin` | `--email` / `-e` · `--firstName` / `-n` · `--lastName` / `-l` · `--password` / `-p` | Crea un usuario superadmin (crea su propio tenant automáticamente)          |

---

## Roles

Los roles se definen en `app/enums/role_enum.ts` y se sincronizan con `node ace sync:roles`.

| Código         | Nombre                    | Scope  | Permisos | Descripción                                             |
| -------------- | ------------------------- | ------ | :------: | ------------------------------------------------------- |
| `superadmin`   | Super Administrador       | Global |    22    | Control total del sistema. Accede a todos los tenants.  |
| `admin`        | Administrador de Gimnasio | Tenant |    22    | Gestión total de su propio gimnasio.                    |
| `receptionist` | Recepcionista             | Tenant |    8     | Gestión de socios, cobros y asistencia diaria.          |
| `coach`        | Entrenador                | Tenant |    6     | Entrenamiento: socios, asistencia, rutinas y clases.    |

> **Scope Global:** `superadmin` tiene su propio tenant interno y puede actuar sobre cualquier gimnasio.  
> **Scope Tenant:** el resto de roles solo pueden operar dentro del gimnasio al que pertenecen.

> `MEMBER` y `GUEST` están definidos en el enum pero no tienen permisos asignados por `sync:roles`. Son roles reservados para uso futuro.

---

## Permisos por módulo

Los permisos se definen en `app/enums/permissions_enum.ts` y se sincronizan con `node ace sync:permissions`.

Total: **22 permisos** en **7 módulos**.

### auth — Usuarios y Roles

| Código          | Nombre             | Descripción                           |
| --------------- | ------------------ | ------------------------------------- |
| `users:manage`  | Gestionar Usuarios | Administrar personal y accesos        |
| `roles:manage`  | Gestionar Roles    | Asignar y modificar roles de usuarios |

### clients — Socios y Membresías

| Código               | Nombre               | Descripción                                            |
| -------------------- | -------------------- | ------------------------------------------------------ |
| `clients:read`       | Ver Socios           | Listado y búsqueda de socios                           |
| `clients:write`      | Editar Socios        | Crear y modificar perfiles de socios                   |
| `clients:delete`     | Eliminar Socios      | Dar de baja o eliminar socios                          |
| `memberships:manage` | Gestionar Membresías | Alta, renovación y cancelación de membresías de socios |

### finance — Pagos y Planes

| Código            | Nombre           | Descripción                                  |
| ----------------- | ---------------- | -------------------------------------------- |
| `payments:read`   | Ver Cobros       | Consultar historial de pagos                 |
| `payments:write`  | Registrar Cobros | Procesar pagos de mensualidades              |
| `payments:cancel` | Anular Pago      | Anular o revertir pagos registrados          |
| `plans:manage`    | Gestionar Planes | Configurar costos y beneficios de membresías |

### operations — Asistencia y Sucursales

| Código               | Nombre               | Descripción                                  |
| -------------------- | -------------------- | -------------------------------------------- |
| `attendance:checkin` | Check-in Asistencia  | Registrar entrada/salida de socios           |
| `attendances:view`   | Ver Asistencias      | Consultar historial de asistencias           |
| `branch:manage`      | Gestionar Sucursales | Crear y configurar sucursales                |

### fitness — Clases y Entrenadores

| Código            | Nombre                  | Descripción                       |
| ----------------- | ----------------------- | --------------------------------- |
| `classes:manage`  | Gestionar Clases        | Crear horarios y clases grupales  |
| `trainers:manage` | Gestionar Entrenadores  | Alta y asignación de entrenadores |

### workout — Rutinas y Catálogo

| Código            | Nombre             | Descripción                              |
| ----------------- | ------------------ | ---------------------------------------- |
| `routines:manage` | Gestionar Rutinas  | Crear y asignar rutinas de entrenamiento |
| `catalog:manage`  | Gestionar Catálogo | Catálogo de ejercicios y materiales      |

### system — Sistema

| Código                  | Nombre                   | Descripción                                    |
| ----------------------- | ------------------------ | ---------------------------------------------- |
| `settings:manage`       | Ajustes del Sistema      | Configuración global del tenant                |
| `audit:view`            | Ver Auditoría            | Consultar registros de auditoría               |
| `reports:view`          | Ver Reportes             | Acceder a reportes y estadísticas del gimnasio |
| `documents:manage`      | Gestionar Documentos     | Subir y gestionar documentos del tenant        |
| `notifications:manage`  | Gestionar Notificaciones | Enviar y gestionar notificaciones a socios     |

---

## Matriz de roles y permisos

Refleja exactamente lo definido en `commands/sync_roles.ts`.

`✓` = tiene el permiso · vacío = sin acceso

| Permiso                | superadmin | admin | receptionist | coach |
| ---------------------- | :--------: | :---: | :----------: | :---: |
| `users:manage`         |     ✓      |   ✓   |              |       |
| `roles:manage`         |     ✓      |   ✓   |              |       |
| `clients:read`         |     ✓      |   ✓   |      ✓       |   ✓   |
| `clients:write`        |     ✓      |   ✓   |      ✓       |       |
| `clients:delete`       |     ✓      |   ✓   |              |       |
| `memberships:manage`   |     ✓      |   ✓   |      ✓       |       |
| `payments:read`        |     ✓      |   ✓   |      ✓       |       |
| `payments:write`       |     ✓      |   ✓   |      ✓       |       |
| `payments:cancel`      |     ✓      |   ✓   |              |       |
| `plans:manage`         |     ✓      |   ✓   |      ✓       |       |
| `attendance:checkin`   |     ✓      |   ✓   |      ✓       |   ✓   |
| `attendances:view`     |     ✓      |   ✓   |      ✓       |   ✓   |
| `branch:manage`        |     ✓      |   ✓   |              |       |
| `classes:manage`       |     ✓      |   ✓   |              |   ✓   |
| `trainers:manage`      |     ✓      |   ✓   |              |       |
| `routines:manage`      |     ✓      |   ✓   |              |   ✓   |
| `catalog:manage`       |     ✓      |   ✓   |              |   ✓   |
| `settings:manage`      |     ✓      |   ✓   |              |       |
| `audit:view`           |     ✓      |   ✓   |              |       |
| `reports:view`         |     ✓      |   ✓   |              |       |
| `documents:manage`     |     ✓      |   ✓   |              |       |
| `notifications:manage` |     ✓      |   ✓   |              |       |
