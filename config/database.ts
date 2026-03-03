import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',

  connections: {
    postgres: {
      client: 'pg',

      connection: {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT || 5432),
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DB_NAME,
      },

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      debug: app.inDev,
    },
  },
})

export default dbConfig
