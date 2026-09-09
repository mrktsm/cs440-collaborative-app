import 'dotenv/config'

/**
 * Knex is used only for migrations here — the app itself still talks to
 * MySQL directly through mysql2 (see src/db.js). Reuses the same DB_*
 * env vars as the rest of the server so local dev, Docker, and Railway
 * all migrate the same way.
 */
const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_NAME || 'song_list',
  },
  migrations: {
    directory: './migrations',
    extension: 'js',
  },
}

export default config
