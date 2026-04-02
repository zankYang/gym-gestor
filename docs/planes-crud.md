# CRUD Planes (`/api/plans`)

## Autenticación y permisos

- Requiere `Bearer` token.
- Requiere permiso: `plans:manage`.
- En todos los endpoints aplica scoping por tenant:
  - `SUPERADMIN`: puede listar/crear/actualizar en `tenantId` indicado.
  - Roles `ADMIN` (y otros no `SUPERADMIN`): operan únicamente dentro de `tenantId` del usuario autenticado.

## Endpoints

### Listar planes

`GET /api/plans`

Parámetros (query):

- `page` (opcional)
- `perPage` (opcional)
- `q` (opcional): búsqueda por `name`, `code` y `description`
- `status` (opcional): `Activo`, `Inactivo` o `Suspendido`
- `sortBy` (opcional): campo para ordenar (ej: `created_at`)
- `sortDir` (opcional): `asc` o `desc`
- `tenantId` (opcional, `SUPERADMIN`): filtra por tenant

Ejemplo:

```bash
GET /api/plans?tenantId=1&page=1&perPage=10&q=mensual&status=Activo&sortBy=created_at&sortDir=desc
```

Respuesta `200`:

```json
{
  "message": "Planes listados correctamente",
  "meta": { "total": 2, "per_page": 10, "current_page": 1 },
  "data": [{ "id": 1, "...": "..." }]
}
```

### Crear plan

`POST /api/plans`

Body (JSON):

- `name` (string, requerido)
- `code` (string, requerido, único por tenant)
- `description` (string|null, opcional)
- `durationDays` (number entero, requerido)
- `price` (string decimal con 2 decimales, requerido; ej: `"50.00"`)
- `allowsClasses` (boolean, opcional)
- `allowsFreeze` (boolean, opcional)
- `freezeDaysLimit` (number entero >= 0, opcional)
- `status` (string opcional): `Activo`, `Inactivo` o `Suspendido`
- `tenantId` (number opcional, solo `SUPERADMIN`)

Ejemplo:

```json
{
  "tenantId": 2,
  "name": "Plan Mensual",
  "code": "MENSUAL",
  "description": "Acceso ilimitado durante 30 días",
  "durationDays": 30,
  "price": "50.00",
  "allowsClasses": false,
  "allowsFreeze": true,
  "freezeDaysLimit": 5,
  "status": "Activo"
}
```

Respuesta `201`:

```json
{
  "message": "Plan creado correctamente",
  "data": { "id": 1, "...": "..." }
}
```

Errores típicos:

- `409`:

```json
{ "errors": [{ "message": "Ya existe un plan con ese código en este gym" }] }
```

- `422` (validación):

```json
{ "errors": [{ "field": "code", "message": "..." }] }
```

### Ver plan

`GET /api/plans/:id`

Respuesta `200`:

```json
{ "message": "Plan encontrado", "data": { "id": 1, "...": "..." } }
```

Respuesta `404`:

```json
{ "errors": [{ "message": "Plan no encontrado" }] }
```

### Actualizar plan

`PATCH /api/plans/:id`

Body (JSON): todos los campos son opcionales (pero si envías alguno, deben ser válidos).

- Soporta cambios de `code` y/o `tenantId` (si eres `SUPERADMIN`).
- Si `code` + `tenantId` entran en conflicto con otro plan existente, devuelve `409`.

Respuesta `200`:

```json
{ "message": "Plan actualizado correctamente", "data": { "id": 1, "...": "..." } }
```

Respuesta `409`:

```json
{ "errors": [{ "message": "Ya existe un plan con ese código en este gym" }] }
```

### Dar de baja plan

`DELETE /api/plans/:id`

- Realiza `soft delete` (marca `deletedAt`).

Respuesta `200`:

```json
{ "message": "Plan dado de baja correctamente" }
```

Respuesta `404`:

```json
{ "errors": [{ "message": "Plan no encontrado" }] }
```
