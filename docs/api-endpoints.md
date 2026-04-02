# API HTTP — Endpoints

Prefijo base de la API: **`/api`**. Todas las rutas bajo `/api` (salvo indicación contraria) requieren cabecera **`X-Tenant-Slug`**: el subdominio del tenant (primer segmento del host), p. ej. `migym.localhost:3333` → slug `migym`.

Ruta de comprobación del servidor (fuera de `/api`):

| Método | Ruta | Body | Respuesta                 |
| ------ | ---- | ---- | ------------------------- |
| `GET`  | `/`  | —    | `{ "server": "running" }` |

Formato habitual de **éxito**:

```json
{ "message": "..." }
```

o con datos:

```json
{ "message": "...", "data": {} }
```

Listados paginados:

```json
{
  "message": "...",
  "meta": {
    "total": 0,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "...",
    "last_page_url": "...",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": []
}
```

Formato habitual de **error**:

```json
{
  "errors": [{ "message": "..." }]
}
```

Validación (422): cada elemento puede incluir `field` con el nombre del campo.

Las respuestas serializan los modelos Lucid en **camelCase**; fechas y timestamps suelen ir en **ISO 8601**. Los ejemplos siguientes reflejan los campos de [`database/schema.ts`](../database/schema.ts). Nota: en **User**, el campo `passwordHash` puede aparecer en JSON; no debe mostrarse en cliente (valor sensible).

### Referencia: objeto `Tenant`

```json
{
  "id": 1,
  "name": "Mi Gym",
  "slug": "migym",
  "logoUrl": null,
  "banner": null,
  "backgroundImageUrl": null,
  "primaryColor": null,
  "secondaryColor": null,
  "email": null,
  "phone": null,
  "address": null,
  "status": "Activo",
  "config": null,
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null
}
```

### Referencia: objeto `User` (detalle / crear / actualizar)

```json
{
  "id": 1,
  "tenantId": 1,
  "roleId": 2,
  "branchId": null,
  "firstName": "Nombre",
  "lastName": "Apellido",
  "avatarUrl": null,
  "email": "user@ejemplo.com",
  "phone": "5512345678901",
  "passwordHash": "$scrypt$...",
  "status": "Activo",
  "lastLoginAt": null,
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null
}
```

### Referencia: objeto `User` en listado (`GET /api/users`)

Incluye relación `role` con solo `id`, `name`, `code` (preload select en el controlador):

```json
{
  "id": 1,
  "tenantId": 1,
  "roleId": 2,
  "branchId": null,
  "firstName": "Nombre",
  "lastName": "Apellido",
  "avatarUrl": null,
  "email": "user@ejemplo.com",
  "phone": "5512345678901",
  "passwordHash": "$scrypt$...",
  "status": "Activo",
  "lastLoginAt": null,
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null,
  "role": {
    "id": 2,
    "name": "Administrador de Gimnasio",
    "code": "admin"
  }
}
```

### Referencia: objeto `Client`

```json
{
  "id": 1,
  "tenantId": 1,
  "branchId": null,
  "firstName": "Juan",
  "lastName": "Pérez",
  "gender": "M",
  "email": "juan@ejemplo.com",
  "phone": "+34600000000",
  "birthDate": "1990-05-15T00:00:00.000+00:00",
  "height": "175.00",
  "weight": "70.00",
  "medicalNotes": null,
  "emergencyContactName": null,
  "emergencyContactPhone": null,
  "notes": null,
  "status": "Activo",
  "joinedAt": "2025-01-15T10:00:00.000+00:00",
  "createdBy": 1,
  "updatedBy": null,
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null
}
```

### Referencia: objeto `MembershipPlan`

```json
{
  "id": 1,
  "tenantId": 1,
  "name": "Plan mensual",
  "code": "MENSUAL",
  "description": "Texto opcional",
  "durationDays": 30,
  "price": "50.00",
  "allowsClasses": false,
  "allowsFreeze": true,
  "freezeDaysLimit": 5,
  "status": "Activo",
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null
}
```

### Referencia: objeto `Role` (catálogo)

```json
{
  "id": 2,
  "name": "Administrador de Gimnasio",
  "code": "admin",
  "description": "...",
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00"
}
```

### Referencia: objeto `Branch` (precarga en membresías)

```json
{
  "id": 1,
  "tenantId": 1,
  "name": "Sede central",
  "code": "MAIN",
  "phone": null,
  "email": null,
  "address": null,
  "status": "Activo",
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null
}
```

### Referencia: objeto `ClientMembership` con relaciones (`client`, `membershipPlan`, `branch`)

```json
{
  "id": 1,
  "tenantId": 1,
  "clientId": 1,
  "membershipPlanId": 1,
  "branchId": null,
  "startDate": "2025-06-01T00:00:00.000+00:00",
  "endDate": "2025-07-01T00:00:00.000+00:00",
  "status": "Activo",
  "priceAtPurchase": "100.00",
  "discountAmount": "0.00",
  "finalAmount": "100.00",
  "autoRenew": false,
  "frozenDaysUsed": 0,
  "notes": null,
  "createdBy": 1,
  "updatedBy": null,
  "createdAt": "2025-01-15T10:00:00.000+00:00",
  "updatedAt": "2025-01-15T10:00:00.000+00:00",
  "deletedAt": null,
  "client": {},
  "membershipPlan": {},
  "branch": null
}
```

En la API, `client` y `membershipPlan` son objetos completos (véanse las referencias **Client** y **MembershipPlan** más arriba); `branch` es un objeto **Branch** completo o `null`.

---

## Auth

### `POST /api/auth/login`

Autenticación. No requiere `Authorization`; sí **`X-Tenant-Slug`**.

**Body (JSON):**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "********"
}
```

**Respuesta 200:**

```json
{
  "message": "Conectado correctamente",
  "data": {
    "token": "oat_xxxxxxxx...",
    "tenant": {
      "id": 1,
      "name": "Mi Gym",
      "slug": "migym",
      "logoUrl": null,
      "banner": null,
      "backgroundImageUrl": null,
      "primaryColor": null,
      "secondaryColor": null,
      "email": null,
      "phone": null,
      "address": null,
      "status": "Activo",
      "config": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "permissions": ["users:read", "users:write", "clients:read", "plans:manage", "memberships:view"]
  }
}
```

`permissions` son los códigos de [`PermissionCode`](../app/enums/permissions_enum.ts) que el usuario tiene vía su rol (y relación `role.permissions` cargada en login).

---

### `POST /api/auth/logout`

Cierra la sesión del token actual.

**Headers:** `Authorization: Bearer <token>`

**Body:** —

**Respuesta 200:**

```json
{ "message": "Desconectado correctamente" }
```

---

## Configuración y catálogos (tenant)

### `GET /api/tenant-config`

Devuelve el tenant actual.

**Headers:** `X-Tenant-Slug` (no exige login).

**Respuesta 200:**

```json
{
  "message": "Configuración del tenant obtenida correctamente",
  "data": {
    "tenant": {
      "id": 1,
      "name": "Mi Gym",
      "slug": "migym",
      "logoUrl": null,
      "banner": null,
      "backgroundImageUrl": null,
      "primaryColor": null,
      "secondaryColor": null,
      "email": null,
      "phone": null,
      "address": null,
      "status": "Activo",
      "config": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    }
  }
}
```

---

### `GET /api/permissions`

Permisos del rol del usuario autenticado (códigos).

**Headers:** `Authorization: Bearer <token>`, `X-Tenant-Slug`

**Respuesta 200:**

```json
{
  "message": "Permisos obtenidos correctamente",
  "data": {
    "permissions": [
      "clients:read",
      "clients:write",
      "plans:manage",
      "memberships:view",
      "memberships:manage"
    ]
  }
}
```

(`data.permissions` son solo los códigos del rol del usuario autenticado, mapeados desde `consumer.role.permissions`.)

---

### `GET /api/catalog-roles`

Listado de roles (catálogo; excluye superadmin según scope del modelo).

**Headers:** `Authorization: Bearer <token>`, `X-Tenant-Slug`

**Respuesta 200:**

```json
{
  "message": "Roles obtenidos correctamente",
  "data": [
    {
      "id": 2,
      "name": "Administrador de Gimnasio",
      "code": "admin",
      "description": "Gestión total de su propio gimnasio (tenant)",
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00"
    },
    {
      "id": 3,
      "name": "Recepcionista",
      "code": "receptionist",
      "description": "Gestión de socios, cobros y asistencia diaria",
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00"
    }
  ]
}
```

(El scope `withoutSuperadmin` excluye el rol superadmin del listado.)

---

## Admin — Tenants

Grupo: `middleware.auth()` + permiso base `TENANTS_READ`. Solo **superadmin** puede ejecutar la lógica de listado/creación/edición/borrado (el controlador devuelve **403** si el rol no es superadmin).

### `GET /api/admin/tenants`

**Query (sin validador Vine; parámetros en query string):**

| Parámetro                  | Descripción                               |
| -------------------------- | ----------------------------------------- |
| `page`, `perPage`          | Paginación (por defecto 1 y 10)           |
| `q`                        | Búsqueda en nombre, slug, email, teléfono |
| `status`                   | Filtro por estado                         |
| `sortBy`                   | Columna (por defecto `name`)              |
| `sortDir`                  | `asc` o `desc`                            |
| `createdFrom`, `createdTo` | Filtro por `created_at`                   |

**Respuesta 200:**

```json
{
  "message": "Tenants listados correctamente",
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=1",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": [
    {
      "id": 1,
      "name": "Mi Gym",
      "slug": "migym",
      "logoUrl": null,
      "banner": null,
      "backgroundImageUrl": null,
      "primaryColor": null,
      "secondaryColor": null,
      "email": null,
      "phone": null,
      "address": null,
      "status": "Activo",
      "config": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    }
  ]
}
```

`data` es un array de objetos **Tenant** (misma forma que la referencia al inicio del documento).

---

### `POST /api/admin/tenants`

Permiso de ruta: `TENANTS_WRITE`.

**Body (JSON):**

```json
{
  "name": "Mi Gym",
  "slug": "migym",
  "logoUrl": null,
  "banner": null,
  "backgroundImageUrl": null,
  "primaryColor": null,
  "secondaryColor": null,
  "email": null,
  "phone": null,
  "address": null,
  "status": "Activo"
}
```

`status`: valores del enum (`Activo`, `Inactivo`, `Suspendido`, etc. según [`Status`](app/enums/status_enum.ts)).

**Respuesta 201:**

```json
{
  "message": "Tenant creado correctamente",
  "data": {
    "id": 1,
    "name": "Mi Gym",
    "slug": "migym",
    "logoUrl": null,
    "banner": null,
    "backgroundImageUrl": null,
    "primaryColor": null,
    "secondaryColor": null,
    "email": null,
    "phone": null,
    "address": null,
    "status": "Activo",
    "config": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `PATCH /api/admin/tenants/:id`

Permiso: `TENANTS_WRITE`.

**Body (JSON):** todos opcionales (mismos campos que creación, sin restricción `unique` en validador para slug salvo lógica en controlador).

**Respuesta 200:**

```json
{
  "message": "Tenant actualizado correctamente",
  "data": {
    "id": 1,
    "name": "Mi Gym Actualizado",
    "slug": "migym",
    "logoUrl": null,
    "banner": null,
    "backgroundImageUrl": null,
    "primaryColor": null,
    "secondaryColor": null,
    "email": null,
    "phone": null,
    "address": null,
    "status": "Activo",
    "config": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T11:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `DELETE /api/admin/tenants/:id`

Permiso: `TENANTS_DELETE`.

**Body:** —

**Respuesta 200:**

```json
{ "message": "Tenant dado de baja correctamente" }
```

---

## Usuarios — `/api/users`

Grupo: `auth` + permiso `USERS_MANAGE`. Por ruta se exigen permisos adicionales (lectura/escritura/borrado).

### `GET /api/users`

Permiso: `USERS_READ`.

**Query (validado):**

| Parámetro           | Descripción                                                    |
| ------------------- | -------------------------------------------------------------- |
| `tenantId`          | Solo **superadmin**; filtra por gimnasio                       |
| `page`, `perPage`   | Paginación                                                     |
| `q`                 | Búsqueda en nombre, apellido, email                            |
| `role`              | Código de rol (`superadmin`, `admin`, `receptionist`, `coach`) |
| `status`            | Estado del usuario                                             |
| `sortBy`, `sortDir` | Ordenación                                                     |

**Respuesta 200:**

```json
{
  "message": "Usuarios listados correctamente",
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=1",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "roleId": 2,
      "branchId": null,
      "firstName": "Nombre",
      "lastName": "Apellido",
      "avatarUrl": null,
      "email": "user@ejemplo.com",
      "phone": "5512345678901",
      "passwordHash": "$scrypt$...",
      "status": "Activo",
      "lastLoginAt": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null,
      "role": {
        "id": 2,
        "name": "Administrador de Gimnasio",
        "code": "admin"
      }
    }
  ]
}
```

---

### `POST /api/users`

Permiso: `USERS_WRITE`.

**Body (JSON):**

```json
{
  "tenantId": 1,
  "avatarUrl": "https://...",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "phone": "5512345678901",
  "email": "user@ejemplo.com",
  "password": "secreto12",
  "role": "admin"
}
```

`tenantId`: opcional; en no-superadmin se usa el tenant del usuario. `role`: `admin` | `receptionist` | `coach`.

**Respuesta 201:**

```json
{
  "message": "Usuario creado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "roleId": 2,
    "branchId": null,
    "firstName": "Nombre",
    "lastName": "Apellido",
    "avatarUrl": null,
    "email": "user@ejemplo.com",
    "phone": "5512345678901",
    "passwordHash": "$scrypt$...",
    "status": "Activo",
    "lastLoginAt": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

**409** si el email ya existe en ese tenant:

```json
{ "errors": [{ "message": "Ya existe un usuario con ese email en este gym" }] }
```

---

### `GET /api/users/:id`

Permiso: `USERS_READ`.

**Respuesta 200:**

```json
{
  "message": "Usuario encontrado",
  "data": {
    "id": 1,
    "tenantId": 1,
    "roleId": 2,
    "branchId": null,
    "firstName": "Nombre",
    "lastName": "Apellido",
    "avatarUrl": null,
    "email": "user@ejemplo.com",
    "phone": "5512345678901",
    "passwordHash": "$scrypt$...",
    "status": "Activo",
    "lastLoginAt": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

**404** si no existe o no pertenece al tenant (usuarios no superadmin).

---

### `PATCH /api/users/:id`

Permiso: `USERS_WRITE`.

**Body (JSON):** todos opcionales:

```json
{
  "firstName": "...",
  "lastName": "...",
  "avatarUrl": "https://...",
  "email": "...",
  "phone": "...",
  "password": "...",
  "role": "coach",
  "status": "Activo"
}
```

**Respuesta 200:**

```json
{
  "message": "Usuario actualizado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "roleId": 3,
    "branchId": null,
    "firstName": "Nombre",
    "lastName": "Apellido",
    "avatarUrl": null,
    "email": "user@ejemplo.com",
    "phone": "5512345678901",
    "passwordHash": "$scrypt$...",
    "status": "Activo",
    "lastLoginAt": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T11:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `DELETE /api/users/:id`

Permiso: `USERS_DELETE`.

**Respuesta 200:**

```json
{ "message": "Usuario dado de baja correctamente" }
```

---

## Clientes — `/api/clients`

Grupo: solo `auth` (sin permiso padre). Cada ruta exige permiso de clientes.

### `GET /api/clients`

Permiso: `CLIENTS_READ`.

**Query:**

| Parámetro           | Descripción         |
| ------------------- | ------------------- |
| `tenantId`          | Solo **superadmin** |
| `page`, `perPage`   | Paginación          |
| `q`                 | Búsqueda            |
| `sortBy`, `sortDir` | Ordenación          |

**Respuesta 200:**

```json
{
  "message": "Clientes listados correctamente",
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=1",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "branchId": null,
      "firstName": "Juan",
      "lastName": "Pérez",
      "gender": "M",
      "email": "juan@ejemplo.com",
      "phone": "+34600000000",
      "birthDate": "1990-05-15T00:00:00.000+00:00",
      "height": "175.00",
      "weight": "70.00",
      "medicalNotes": null,
      "emergencyContactName": null,
      "emergencyContactPhone": null,
      "notes": null,
      "status": "Activo",
      "joinedAt": "2025-01-15T10:00:00.000+00:00",
      "createdBy": 1,
      "updatedBy": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    }
  ]
}
```

---

### `POST /api/clients`

Permiso: `CLIENTS_WRITE`.

**Body (JSON):**

```json
{
  "tenantId": 1,
  "branchId": null,
  "firstName": "...",
  "lastName": "...",
  "phone": "...",
  "email": "a@b.com",
  "gender": "M",
  "birthDate": "1990-05-15",
  "height": 175,
  "weight": 70,
  "emergencyContactName": "...",
  "emergencyContactPhone": "...",
  "medicalNotes": "...",
  "notes": "...",
  "status": "Activo"
}
```

Campos opcionales según validador; fechas en formato aceptado por Vine (`vine.date()`).

**Respuesta 201:**

```json
{
  "message": "Cliente creado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "branchId": null,
    "firstName": "Juan",
    "lastName": "Pérez",
    "gender": "M",
    "email": "juan@ejemplo.com",
    "phone": "+34600000000",
    "birthDate": "1990-05-15T00:00:00.000+00:00",
    "height": "175.00",
    "weight": "70.00",
    "medicalNotes": null,
    "emergencyContactName": null,
    "emergencyContactPhone": null,
    "notes": null,
    "status": "Activo",
    "joinedAt": "2025-01-15T10:00:00.000+00:00",
    "createdBy": 1,
    "updatedBy": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `GET /api/clients/:id`

Permiso: `CLIENTS_READ`.

**Respuesta 200:**

```json
{
  "message": "Cliente encontrado",
  "data": {
    "id": 1,
    "tenantId": 1,
    "branchId": null,
    "firstName": "Juan",
    "lastName": "Pérez",
    "gender": "M",
    "email": "juan@ejemplo.com",
    "phone": "+34600000000",
    "birthDate": "1990-05-15T00:00:00.000+00:00",
    "height": "175.00",
    "weight": "70.00",
    "medicalNotes": null,
    "emergencyContactName": null,
    "emergencyContactPhone": null,
    "notes": null,
    "status": "Activo",
    "joinedAt": "2025-01-15T10:00:00.000+00:00",
    "createdBy": 1,
    "updatedBy": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `PATCH /api/clients/:id`

Permiso: `CLIENTS_WRITE`.

**Body:** mismos campos que creación, todos opcionales.

**Respuesta 200:**

```json
{
  "message": "Cliente actualizado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "branchId": null,
    "firstName": "Juan",
    "lastName": "Pérez",
    "gender": "M",
    "email": "juan@ejemplo.com",
    "phone": "+34600000000",
    "birthDate": "1990-05-15T00:00:00.000+00:00",
    "height": "175.00",
    "weight": "70.00",
    "medicalNotes": null,
    "emergencyContactName": null,
    "emergencyContactPhone": null,
    "notes": "Actualizado",
    "status": "Activo",
    "joinedAt": "2025-01-15T10:00:00.000+00:00",
    "createdBy": 1,
    "updatedBy": 1,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T11:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `DELETE /api/clients/:id`

Permiso: `CLIENTS_DELETE`.

**Respuesta 200:**

```json
{ "message": "Cliente dado de baja correctamente" }
```

---

## Planes de membresía (catálogo) — `/api/plans`

Grupo: `auth`. Todas las rutas requieren `PLANS_MANAGE`.

### `GET /api/plans`

**Query:**

| Parámetro           | Descripción                             |
| ------------------- | --------------------------------------- |
| `tenantId`          | Solo **superadmin**                     |
| `page`, `perPage`   | Paginación                              |
| `q`                 | Búsqueda en nombre, código, descripción |
| `status`            | `Activo` \| `Inactivo` \| `Suspendido`  |
| `sortBy`, `sortDir` | Ordenación                              |

**Respuesta 200:**

```json
{
  "message": "Planes listados correctamente",
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=1",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "name": "Plan mensual",
      "code": "MENSUAL",
      "description": "Acceso 30 días",
      "durationDays": 30,
      "price": "50.00",
      "allowsClasses": false,
      "allowsFreeze": true,
      "freezeDaysLimit": 5,
      "status": "Activo",
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    }
  ]
}
```

---

### `POST /api/plans`

**Body (JSON):**

```json
{
  "tenantId": 1,
  "name": "Plan mensual",
  "code": "MENSUAL",
  "description": "...",
  "durationDays": 30,
  "price": "50.00",
  "allowsClasses": false,
  "allowsFreeze": true,
  "freezeDaysLimit": 5,
  "status": "Activo"
}
```

`price`: string con formato `^\d+(\.\d{2})$`. `tenantId` opcional (superadmin).

**Respuesta 201:**

```json
{
  "message": "Plan creado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "name": "Plan mensual",
    "code": "MENSUAL",
    "description": "...",
    "durationDays": 30,
    "price": "50.00",
    "allowsClasses": false,
    "allowsFreeze": true,
    "freezeDaysLimit": 5,
    "status": "Activo",
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

**409** si el código ya existe en el mismo tenant.

---

### `GET /api/plans/:id`

**Respuesta 200:**

```json
{
  "message": "Plan encontrado",
  "data": {
    "id": 1,
    "tenantId": 1,
    "name": "Plan mensual",
    "code": "MENSUAL",
    "description": "Acceso 30 días",
    "durationDays": 30,
    "price": "50.00",
    "allowsClasses": false,
    "allowsFreeze": true,
    "freezeDaysLimit": 5,
    "status": "Activo",
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `PATCH /api/plans/:id`

**Body:** mismos campos que creación, opcionales.

**Respuesta 200:**

```json
{
  "message": "Plan actualizado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "name": "Plan mensual plus",
    "code": "MENSUAL",
    "description": "...",
    "durationDays": 30,
    "price": "55.00",
    "allowsClasses": false,
    "allowsFreeze": true,
    "freezeDaysLimit": 5,
    "status": "Activo",
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T11:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `DELETE /api/plans/:id`

**Respuesta 200:**

```json
{ "message": "Plan dado de baja correctamente" }
```

---

## Membresías de socios — `/api/memberships`

Grupo: `auth`. Lectura: `MEMBERSHIPS_VIEW`. Escritura: `MEMBERSHIPS_MANAGE`.

### `GET /api/memberships`

**Query:**

| Parámetro           | Descripción                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `tenantId`          | Solo **superadmin**                                                                                        |
| `page`, `perPage`   | Paginación                                                                                                 |
| `q`                 | Búsqueda en notas                                                                                          |
| `status`            | `Pendiente`, `Activo`, `Expirado`, `Cancelado`, `Congelado` (valores [`Status`](app/enums/status_enum.ts)) |
| `clientId`          | Filtrar por cliente                                                                                        |
| `sortBy`, `sortDir` | Ordenación                                                                                                 |

**Respuesta 200:**

```json
{
  "message": "Membresías listadas correctamente",
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=1",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "clientId": 1,
      "membershipPlanId": 1,
      "branchId": null,
      "startDate": "2025-06-01T00:00:00.000+00:00",
      "endDate": "2025-07-01T00:00:00.000+00:00",
      "status": "Activo",
      "priceAtPurchase": "100.00",
      "discountAmount": "0.00",
      "finalAmount": "100.00",
      "autoRenew": false,
      "frozenDaysUsed": 0,
      "notes": null,
      "createdBy": 1,
      "updatedBy": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null,
      "client": {
        "id": 1,
        "tenantId": 1,
        "branchId": null,
        "firstName": "Juan",
        "lastName": "Pérez",
        "gender": "M",
        "email": "juan@ejemplo.com",
        "phone": "+34600000000",
        "birthDate": "1990-05-15T00:00:00.000+00:00",
        "height": "175.00",
        "weight": "70.00",
        "medicalNotes": null,
        "emergencyContactName": null,
        "emergencyContactPhone": null,
        "notes": null,
        "status": "Activo",
        "joinedAt": "2025-01-15T10:00:00.000+00:00",
        "createdBy": 1,
        "updatedBy": null,
        "createdAt": "2025-01-15T10:00:00.000+00:00",
        "updatedAt": "2025-01-15T10:00:00.000+00:00",
        "deletedAt": null
      },
      "membershipPlan": {
        "id": 1,
        "tenantId": 1,
        "name": "Plan mensual",
        "code": "MENSUAL",
        "description": null,
        "durationDays": 30,
        "price": "50.00",
        "allowsClasses": false,
        "allowsFreeze": true,
        "freezeDaysLimit": 5,
        "status": "Activo",
        "createdAt": "2025-01-15T10:00:00.000+00:00",
        "updatedAt": "2025-01-15T10:00:00.000+00:00",
        "deletedAt": null
      },
      "branch": null
    }
  ]
}
```

---

### `POST /api/memberships`

**Body (JSON):**

```json
{
  "tenantId": 1,
  "clientId": 1,
  "membershipPlanId": 1,
  "branchId": null,
  "startDate": "2025-01-01",
  "endDate": "2025-02-01",
  "status": "Pendiente",
  "priceAtPurchase": "100.00",
  "discountAmount": "0.00",
  "finalAmount": "100.00",
  "autoRenew": false,
  "frozenDaysUsed": 0,
  "notes": null
}
```

Importes con dos decimales como string. Reglas de negocio adicionales (fechas, coherencia de importes, límites de congelación vs plan) en el controlador.

**Respuesta 201:**

```json
{
  "message": "Membresía creada correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "clientId": 1,
    "membershipPlanId": 1,
    "branchId": null,
    "startDate": "2025-06-01T00:00:00.000+00:00",
    "endDate": "2025-07-01T00:00:00.000+00:00",
    "status": "Pendiente",
    "priceAtPurchase": "100.00",
    "discountAmount": "0.00",
    "finalAmount": "100.00",
    "autoRenew": false,
    "frozenDaysUsed": 0,
    "notes": null,
    "createdBy": 1,
    "updatedBy": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null,
    "client": {
      "id": 1,
      "tenantId": 1,
      "branchId": null,
      "firstName": "Juan",
      "lastName": "Pérez",
      "gender": "M",
      "email": "juan@ejemplo.com",
      "phone": "+34600000000",
      "birthDate": "1990-05-15T00:00:00.000+00:00",
      "height": "175.00",
      "weight": "70.00",
      "medicalNotes": null,
      "emergencyContactName": null,
      "emergencyContactPhone": null,
      "notes": null,
      "status": "Activo",
      "joinedAt": "2025-01-15T10:00:00.000+00:00",
      "createdBy": 1,
      "updatedBy": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "membershipPlan": {
      "id": 1,
      "tenantId": 1,
      "name": "Plan mensual",
      "code": "MENSUAL",
      "description": null,
      "durationDays": 30,
      "price": "50.00",
      "allowsClasses": false,
      "allowsFreeze": true,
      "freezeDaysLimit": 5,
      "status": "Activo",
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "branch": null
  }
}
```

---

### `GET /api/memberships/:id`

**Respuesta 200:**

```json
{
  "message": "Membresía encontrada",
  "data": {
    "id": 1,
    "tenantId": 1,
    "clientId": 1,
    "membershipPlanId": 1,
    "branchId": null,
    "startDate": "2025-06-01T00:00:00.000+00:00",
    "endDate": "2025-07-01T00:00:00.000+00:00",
    "status": "Activo",
    "priceAtPurchase": "100.00",
    "discountAmount": "0.00",
    "finalAmount": "100.00",
    "autoRenew": false,
    "frozenDaysUsed": 0,
    "notes": null,
    "createdBy": 1,
    "updatedBy": null,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null,
    "client": {
      "id": 1,
      "tenantId": 1,
      "branchId": null,
      "firstName": "Juan",
      "lastName": "Pérez",
      "gender": "M",
      "email": "juan@ejemplo.com",
      "phone": "+34600000000",
      "birthDate": "1990-05-15T00:00:00.000+00:00",
      "height": "175.00",
      "weight": "70.00",
      "medicalNotes": null,
      "emergencyContactName": null,
      "emergencyContactPhone": null,
      "notes": null,
      "status": "Activo",
      "joinedAt": "2025-01-15T10:00:00.000+00:00",
      "createdBy": 1,
      "updatedBy": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "membershipPlan": {
      "id": 1,
      "tenantId": 1,
      "name": "Plan mensual",
      "code": "MENSUAL",
      "description": null,
      "durationDays": 30,
      "price": "50.00",
      "allowsClasses": false,
      "allowsFreeze": true,
      "freezeDaysLimit": 5,
      "status": "Activo",
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "branch": null
  }
}
```

---

### `PATCH /api/memberships/:id`

**Body:** mismos campos que creación, opcionales (incl. `tenantId` para superadmin).

**Respuesta 200:**

```json
{
  "message": "Membresía actualizada correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "clientId": 1,
    "membershipPlanId": 1,
    "branchId": null,
    "startDate": "2025-06-01T00:00:00.000+00:00",
    "endDate": "2025-07-01T00:00:00.000+00:00",
    "status": "Activo",
    "priceAtPurchase": "100.00",
    "discountAmount": "0.00",
    "finalAmount": "100.00",
    "autoRenew": false,
    "frozenDaysUsed": 0,
    "notes": "Nota",
    "createdBy": 1,
    "updatedBy": 1,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T11:00:00.000+00:00",
    "deletedAt": null,
    "client": {
      "id": 1,
      "tenantId": 1,
      "branchId": null,
      "firstName": "Juan",
      "lastName": "Pérez",
      "gender": "M",
      "email": "juan@ejemplo.com",
      "phone": "+34600000000",
      "birthDate": "1990-05-15T00:00:00.000+00:00",
      "height": "175.00",
      "weight": "70.00",
      "medicalNotes": null,
      "emergencyContactName": null,
      "emergencyContactPhone": null,
      "notes": null,
      "status": "Activo",
      "joinedAt": "2025-01-15T10:00:00.000+00:00",
      "createdBy": 1,
      "updatedBy": null,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "membershipPlan": {
      "id": 1,
      "tenantId": 1,
      "name": "Plan mensual",
      "code": "MENSUAL",
      "description": null,
      "durationDays": 30,
      "price": "50.00",
      "allowsClasses": false,
      "allowsFreeze": true,
      "freezeDaysLimit": 5,
      "status": "Activo",
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    },
    "branch": null
  }
}
```

---

### `DELETE /api/memberships/:id`

Borrado lógico (`deleted_at`).

**Respuesta 200:**

```json
{ "message": "Membresía dada de baja correctamente" }
```

---

## Cobros — `/api/payments`

Grupo: `auth`. Lectura: `PAYMENTS_READ`. Escritura: `PAYMENTS_WRITE`. Cancelación: `PAYMENTS_CANCEL`.

### `GET /api/payments`

**Query:**

| Parámetro            | Descripción                                             |
| -------------------- | ------------------------------------------------------- |
| `tenantId`           | Solo **superadmin**                                     |
| `page`, `perPage`    | Paginación                                              |
| `q`                  | Búsqueda en `concept` o `reference`                     |
| `status`             | `Pagado` \| `Pendiente` \| `Cancelado` \| `Reembolsado` |
| `clientId`           | Filtrar por cliente                                     |
| `paymentMethodId`    | Filtrar por método de pago                              |
| `dateFrom`, `dateTo` | Rango de fecha de pago                                  |
| `sortBy`, `sortDir`  | Ordenación                                              |

**Respuesta 200:**

```json
{
  "message": "Cobros listados correctamente",
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "first_page": 1,
    "last_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=1",
    "next_page_url": null,
    "previous_page_url": null
  },
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "clientId": 1,
      "clientMembershipId": null,
      "paymentMethodId": 1,
      "branchId": null,
      "amount": "100.00",
      "paymentDate": "2025-01-15T10:00:00.000+00:00",
      "reference": "ABC123",
      "concept": "Pago membresía",
      "status": "Pagado",
      "notes": null,
      "registeredBy": 1,
      "createdAt": "2025-01-15T10:00:00.000+00:00",
      "updatedAt": "2025-01-15T10:00:00.000+00:00",
      "deletedAt": null
    }
  ]
}
```

---

### `POST /api/payments`

**Body (JSON):**

```json
{
  "tenantId": 1,
  "clientId": 1,
  "clientMembershipId": null,
  "paymentMethodId": 1,
  "branchId": null,
  "amount": "100.00",
  "paymentDate": "2025-01-15",
  "reference": "ABC123",
  "concept": "Pago membresía",
  "status": "Pagado",
  "notes": null
}
```

`tenantId` solo aplica para superadmin. `amount` debe tener formato de 2 decimales y ser mayor a `0`.

**Respuesta 201:**

```json
{
  "message": "Cobro creado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "clientId": 1,
    "clientMembershipId": null,
    "paymentMethodId": 1,
    "branchId": null,
    "amount": "100.00",
    "paymentDate": "2025-01-15T10:00:00.000+00:00",
    "reference": "ABC123",
    "concept": "Pago membresía",
    "status": "Pagado",
    "notes": null,
    "registeredBy": 1,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `GET /api/payments/:id`

**Respuesta 200:**

```json
{
  "message": "Cobro encontrado",
  "data": {
    "id": 1,
    "tenantId": 1,
    "clientId": 1,
    "clientMembershipId": null,
    "paymentMethodId": 1,
    "branchId": null,
    "amount": "100.00",
    "paymentDate": "2025-01-15T10:00:00.000+00:00",
    "reference": "ABC123",
    "concept": "Pago membresía",
    "status": "Pagado",
    "notes": null,
    "registeredBy": 1,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T10:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `PATCH /api/payments/:id`

**Body:** mismos campos de creación, todos opcionales.

Incluye validación de transición de estado (`Pendiente -> Pagado/Cancelado`, `Pagado -> Reembolsado/Cancelado`).

**Respuesta 200:**

```json
{
  "message": "Cobro actualizado correctamente",
  "data": {
    "id": 1,
    "tenantId": 1,
    "clientId": 1,
    "clientMembershipId": null,
    "paymentMethodId": 1,
    "branchId": null,
    "amount": "100.00",
    "paymentDate": "2025-01-15T10:00:00.000+00:00",
    "reference": "ABC123",
    "concept": "Pago membresía",
    "status": "Pagado",
    "notes": "Actualizado",
    "registeredBy": 1,
    "createdAt": "2025-01-15T10:00:00.000+00:00",
    "updatedAt": "2025-01-15T11:00:00.000+00:00",
    "deletedAt": null
  }
}
```

---

### `POST /api/payments/:id/cancel`

Permiso: `PAYMENTS_CANCEL`.

**Body (JSON):**

```json
{
  "reason": "Devolución por cobro duplicado",
  "status": "Reembolsado"
}
```

`status` es opcional (`Cancelado` por defecto). El motivo se agrega a `notes`.

**Respuesta 200:**

```json
{
  "message": "Cobro cancelado correctamente",
  "data": {
    "id": 1,
    "status": "Reembolsado",
    "notes": "Motivo de cancelación/reembolso: Devolución por cobro duplicado"
  }
}
```

---

## Asistencias — `/api/attendances`

Grupo: `auth`. Lectura: `ATTENDANCES_VIEW`. Gestión manual: `ATTENDANCES_MANAGE`. Check-in: `ATTENDANCE_CHECKIN`. Checkout: `ATTENDANCES_CHECKOUT`. Baja lógica: `ATTENDANCES_DELETE`.

### `GET /api/attendances`

**Query:**

| Parámetro            | Descripción                           |
| -------------------- | ------------------------------------- |
| `tenantId`           | Solo **superadmin**                   |
| `page`, `perPage`    | Paginación                            |
| `q`                  | Búsqueda en notas                     |
| `status`             | `Checkin` \| `Checkout` \| `Denegado` |
| `clientId`           | Filtrar por cliente                   |
| `branchId`           | Filtrar por sucursal                  |
| `dateFrom`, `dateTo` | Rango de fecha de asistencia          |
| `sortBy`, `sortDir`  | Ordenación                            |

### `POST /api/attendances`

Alta manual de sesión de asistencia (caso administrativo).

**Body (JSON):**

```json
{
  "tenantId": 1,
  "clientId": 1,
  "clientMembershipId": 1,
  "branchId": 1,
  "attendanceDate": "2026-03-23",
  "checkInAt": "2026-03-23T10:00:00.000Z",
  "checkOutAt": null,
  "status": "Checkin",
  "notes": "Registro manual"
}
```

### `GET /api/attendances/:id`

Obtiene detalle de asistencia con relaciones (`client`, `clientMembership`, `branch`, `events`).

### `PATCH /api/attendances/:id`

Actualiza asistencia manualmente (también registra evento auxiliar de ajuste).

### `DELETE /api/attendances/:id`

Baja lógica (`deleted_at`) y trazabilidad como ajuste manual.

### `POST /api/attendances/checkin`

Endpoint operativo de entrada.

**Body (JSON):**

```json
{
  "tenantId": 1,
  "clientId": 1,
  "clientMembershipId": 1,
  "branchId": 1,
  "checkInAt": "2026-03-23T10:00:00.000Z",
  "notes": "Ingreso por recepción"
}
```

Reglas principales:

- valida cliente/membresía/sucursal dentro del tenant;
- evita doble sesión abierta del cliente;
- registra evento `checkin`.

### `POST /api/attendances/:id/checkout`

Endpoint operativo de salida para sesión abierta.

**Body (JSON):**

```json
{
  "checkOutAt": "2026-03-23T11:15:00.000Z",
  "notes": "Salida normal"
}
```

Reglas principales:

- solo sobre asistencia abierta (`status = Checkin`);
- `checkOutAt >= checkInAt`;
- actualiza estado a `Checkout`;
- registra evento `checkout`.

---

## Referencia rápida de permisos por ruta

| Ruta (prefijo `/api`)                     | Permisos                                     |
| ----------------------------------------- | -------------------------------------------- |
| `admin/tenants` GET                       | `TENANTS_READ` (+ superadmin en controlador) |
| `admin/tenants` POST                      | `TENANTS_WRITE` (+ superadmin)               |
| `admin/tenants/:id` PATCH                 | `TENANTS_WRITE` (+ superadmin)               |
| `admin/tenants/:id` DELETE                | `TENANTS_DELETE` (+ superadmin)              |
| `users` GET                               | `USERS_MANAGE` + `USERS_READ`                |
| `users` POST                              | `USERS_MANAGE` + `USERS_WRITE`               |
| `users/:id` GET                           | `USERS_MANAGE` + `USERS_READ`                |
| `users/:id` PATCH                         | `USERS_MANAGE` + `USERS_WRITE`               |
| `users/:id` DELETE                        | `USERS_MANAGE` + `USERS_DELETE`              |
| `clients` GET                             | `CLIENTS_READ`                               |
| `clients` POST                            | `CLIENTS_WRITE`                              |
| `clients/:id` GET                         | `CLIENTS_READ`                               |
| `clients/:id` PATCH                       | `CLIENTS_WRITE`                              |
| `clients/:id` DELETE                      | `CLIENTS_DELETE`                             |
| `plans` \*                                | `PLANS_MANAGE`                               |
| `memberships` GET                         | `MEMBERSHIPS_VIEW`                           |
| `memberships` POST / PATCH / DELETE       | `MEMBERSHIPS_MANAGE`                         |
| `payments` GET / `payments/:id` GET       | `PAYMENTS_READ`                              |
| `payments` POST / PATCH                   | `PAYMENTS_WRITE`                             |
| `payments/:id/cancel` POST                | `PAYMENTS_CANCEL`                            |
| `attendances` GET / `attendances/:id` GET | `ATTENDANCES_VIEW`                           |
| `attendances` POST / PATCH                | `ATTENDANCES_MANAGE`                         |
| `attendances/checkin` POST                | `ATTENDANCE_CHECKIN`                         |
| `attendances/:id/checkout` POST           | `ATTENDANCES_CHECKOUT`                       |
| `attendances/:id` DELETE                  | `ATTENDANCES_DELETE`                         |
| `auth/logout`                             | usuario autenticado                          |
| `permissions`, `catalog-roles`            | `auth`                                       |

Los códigos exactos de permisos están en [`app/enums/permissions_enum.ts`](../app/enums/permissions_enum.ts).
