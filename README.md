# Gym Gestor

Sistema de gestión para gimnasios.

## Tecnologías y versiones

### Entorno de ejecución

| Tecnología  | Versión                |
| ----------- | ---------------------- |
| **Node.js** | 24.14.x (ver `.nvmrc`) |

### Backend

| Tecnología     | Versión |
| -------------- | ------- |
| **AdonisJS**   | 7.x     |
| **TypeScript** | 5.9.x   |

### Base de datos

| Tecnología     | Versión |
| -------------- | ------- |
| **PostgreSQL** | 18      |

### Desarrollo y calidad de código

| Tecnología       | Versión |
| ---------------- | ------- |
| **ESLint**       | ^10.0.2 |
| **Prettier**     | ^3.8.1  |
| **Japa** (tests) | ^5.x    |

---

## Requisitos previos

- **Node.js** 24.14.x (recomendado: `nvm use` si usas nvm)
- **PostgreSQL** 18 en ejecución

## Instalación

Con **nvm** (Node Version Manager) y **pnpm** instalados:

```bash
# 1. Usar la versión de Node del proyecto (24.14.x)
nvm use


# 2. Instalar dependencias
pnpm install

# 3. Copiar variables de entorno y configurar (crear .env con tu conexión a PostgreSQL)
cp .env.example .env
node ace generate:key
cp .env .env.test
# Cambiar las variables de database para usar la de test

# 4. Ejecutar migraciones
node ace migration:run

# 5. (Opcional) Crear el primer superadmin
node ace create:superadmin

# 6. Arrancar el servidor de desarrollo
pnpm dev
```

Si no usas nvm, instala Node.js 24.14.x y luego ejecuta desde el paso 3.

## Scripts

| Comando          | Descripción                    |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Servidor de desarrollo con HMR |
| `pnpm build`     | Build de producción            |
| `pnpm start`     | Ejecutar en producción         |
| `pnpm test`      | Ejecutar tests                 |
| `pnpm lint`      | Linter                         |
| `pnpm format`    | Formatear código               |
| `pnpm typecheck` | Comprobar tipos TypeScript     |

Para ejecutar solo un grupo de tests: `node ace test --group "Nombre del grupo"`.

## Migraciones

Comandos típicos de Lucid (base de datos):

| Comando                                          | Descripción                     |
| ------------------------------------------------ | ------------------------------- |
| `node ace migration:run`                         | Ejecutar migraciones pendientes |
| `node ace migration:rollback`                    | Revertir la última migración    |
| `node ace migration:status`                      | Ver estado de las migraciones   |
| `node ace make:migration nombre_de_la_migracion` | Crear una nueva migración       |

## Comandos Ace (personalizados)

| Comando                                                                                          | Descripción                                                  |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `node ace create:superadmin --email=tu@email.com --fullName="Tu nombre" --password=tucontraseña` | Crear superadmin con flags personalizados (`-e`, `-n`, `-p`) |

## Contribución

Antes de abrir un PR: `pnpm lint`, `pnpm typecheck` y `pnpm test` deben pasar.

## Licencia

MIT
