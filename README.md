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
nvm install
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

| Comando                                                                                                              | Descripción                                                        |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `node ace create:superadmin --email=tu@email.com --firstName="Nombre" --lastName="Apellido" --password=tucontraseña` | Crear superadmin con flags personalizados (`-e`, `-n`, `-l`, `-p`) |
| `node ace sync:permissions`                                                                                          | Sincroniza los permisos del enum con la base de datos              |

## Documentación útil

- **TypeScript**: tipos y características del lenguaje \(`https://www.typescriptlang.org/docs/`\)
- **AdonisJS**: documentación oficial del framework \(`https://docs.adonisjs.com/introduction`\)
- **Lucid (ORM de AdonisJS)**: documentación oficial \(`https://lucid.adonisjs.com/docs/introduction`\)
- **Faker.js**: generación de datos falsos para seeds y tests \(`https://fakerjs.dev/api/`\)
- **Japa**: runner de tests usado en el proyecto \(`https://japa.dev/docs/introduction`\)
- **PostgreSQL**: documentación oficial de la base de datos \(`https://www.postgresql.org/docs/18/index.html`\)
- **ESLint**: reglas y configuración de linting \(`https://eslint.org/docs/latest/`\)
- **Prettier**: formateador de código \(`https://prettier.io/docs/en/`\)
- **Node.js**: documentación de la versión LTS usada \(`https://nodejs.org/docs/latest-v24.x/api/`\)

## Contribución

Antes de abrir un PR: `pnpm lint`, `pnpm typecheck` y `pnpm test` deben pasar.

### Proceso para subir cambios

La rama por defecto del repositorio es `**dev**`. Cualquier cambio que quieras incorporar a `dev` debe seguir este flujo:

1. **Crear una rama** desde `dev` con tu trabajo (por ejemplo `feature/nombre` o `fix/descripcion`).
2. **Abrir un Pull Request (PR)** hacia la rama `dev`. No se aceptan pushes directos a `dev`.
3. **Revisión y aprobación**: el PR debe ser revisado y aprobado por al menos una persona con permisos. Para que un PR sea aprobado, debe incluir:

- **Tests**: pruebas (Japa) que cubran la funcionalidad o el fix que introduces.
- **Bruno**: colección o peticiones en [Bruno](https://www.usebruno.com/) para probar manualmente los endpoints o flujos afectados.

4. **CI debe pasar**: el workflow de GitHub Actions (`.github/workflows/ci.yml`) se ejecuta en cada push y en cada PR hacia `main`, `develop` y `dev`. El CI ejecuta:

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- migraciones y `pnpm test`
  El PR solo puede integrarse cuando el CI esté en verde.

5. **Merge**: una vez aprobado y con el CI en verde, se hace merge del PR a `dev`.

En resumen: **todo cambio a `dev` pasa por un PR, con aprobación y con el CI en verde.**

### Extensiones recomendadas (VS Code)

Para tener una mejor DX, se recomiendan las siguientes extensiones en VS Code:

- **AdonisJS**: soporte para snippets, comandos y ayudas específicas del framework.
- **Prettier**: formateo automático consistente con la configuración del proyecto.
- **Conventional Commits**: ayuda a escribir mensajes de commit siguiendo el estándar definido en este README.
- **ESLint**: muestra problemas de linting directamente en el editor.
- **GitLens**: mejora la experiencia con Git (historial, blame, comparación de cambios).
- **Japa**: soporte para tests con Japa (snippets, ejecución focalizada, etc.).

## Commits: buenas prácticas y Conventional Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit claros y automatizables.

### Formato del mensaje

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[pie opcional]
```

- **tipo**: indica el tipo de cambio (ver más abajo).
- **ámbito**: parte del proyecto afectada (ej. `auth`, `migrations`, `api`).
- **descripción**: resumen breve en imperativo («añade» no «añadido» ni «añadiendo»).

### Tipos de commit

| Tipo       | Uso                                                                      |
| ---------- | ------------------------------------------------------------------------ |
| `feat`     | Nueva funcionalidad.                                                     |
| `fix`      | Corrección de un bug.                                                    |
| `docs`     | Solo documentación (README, comentarios, etc.).                          |
| `style`    | Cambios de formato (espacios, punto y coma, etc.), sin cambio de lógica. |
| `refactor` | Cambio de código que no añade funcionalidad ni corrige un bug.           |
| `perf`     | Mejora de rendimiento.                                                   |
| `test`     | Añadir o modificar tests.                                                |
| `chore`    | Tareas de mantenimiento (deps, config, scripts).                         |
| `ci`       | Cambios en CI/CD.                                                        |
| `build`    | Cambios en el sistema de build o dependencias externas.                  |

### Buenas prácticas

- **Un commit = un cambio lógico**: evita mezclar varias funcionalidades o fixes en un solo commit.
- **Descripción en imperativo**: «añade login» en lugar de «añadido login» o «añadiendo login».
- **Línea de asunto ≤ 72 caracteres**: facilita la lectura en logs y herramientas.
- **Cuerpo opcional**: si hace falta contexto, usa el cuerpo del mensaje para explicar el _qué_ y el _por qué_.
- **Breaking changes**: si rompes compatibilidad, indica en el pie: `BREAKING CHANGE: descripción` o usa `!` tras el tipo/ámbito (ej. `feat(api)!: cambia contrato del endpoint`).

### Ejemplos

```bash
feat(auth): añade login con email y contraseña
fix(migrations): corrige tipo de columna en tabla users
docs: actualiza instrucciones de instalación en README
refactor(api): extrae validación de clientes a servicio
chore(deps): actualiza AdonisJS a 7.1.0
feat(api)!: reemplaza paginación por cursor
```

## Licencia

MIT
