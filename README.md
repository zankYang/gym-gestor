# Gym Gestor

Sistema de gestión para gimnasios.

## Tecnologías y versiones

### Entorno de ejecución
| Tecnología | Versión |
|------------|---------|
| **Node.js** | 24.14.x (ver `.nvmrc`) |

### Backend
| Tecnología | Versión |
|------------|---------|
| **AdonisJS** | 7.x |
| **TypeScript** | 5.9.x |

### Base de datos
| Tecnología | Versión |
|------------|---------|
| **PostgreSQL** | 18 |

### Módulos principales de AdonisJS
| Módulo | Versión |
|--------|---------|
| **@adonisjs/core** | ^7.0.0 |
| **@adonisjs/lucid** (ORM) | ^22.0.0 |
| **@adonisjs/auth** | ^10.0.0 |
| **@adonisjs/session** | ^8.0.0 |
| **@adonisjs/shield** (CSRF, XSS) | ^9.0.0 |
| **@adonisjs/cors** | ^3.0.0 |
| **@vinejs/vine** (validación) | ^4.3.0 |
| **luxon** (fechas) | ^3.7.x |

### Desarrollo y calidad de código
| Tecnología | Versión |
|------------|---------|
| **ESLint** | ^10.0.2 |
| **Prettier** | ^3.8.1 |
| **Japa** (tests) | ^5.x |

---

## Requisitos previos

- **Node.js** 24.14.x (recomendado: `nvm use` si usas nvm)
- **PostgreSQL** 18 en ejecución

## Instalación

```bash
# Dependencias
pnpm install

# Variables de entorno (crear .env con conexión a PostgreSQL 18)
# DB_CONNECTION=pg
# PGHOST=localhost
# PGPORT=5432
# PGUSER=...
# PGPASSWORD=...
# PGDATABASE=gym_gestor
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm start` | Ejecutar en producción |
| `pnpm test` | Ejecutar tests |
| `pnpm lint` | Linter |
| `pnpm format` | Formatear código |
| `pnpm typecheck` | Comprobar tipos TypeScript |

## Licencia

MIT
