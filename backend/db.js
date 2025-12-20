const { Pool } = require("pg");

function isDbConfigured() {
  if (process.env.DATABASE_URL) return true;
  if (process.env.PGDATABASE) return true;
  return false;
}

function createPoolConfig() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    const config = { connectionString };

    if (process.env.PGSSLMODE === "require") {
      config.ssl = { rejectUnauthorized: false };
    }

    return config;
  }

  return {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  };
}

function getDbHint() {
  if (process.env.DATABASE_URL) {
    return "DATABASE_URL is set";
  }

  return `PGHOST=${process.env.PGHOST || ""} PGPORT=${process.env.PGPORT || ""} PGUSER=${process.env.PGUSER || ""} PGDATABASE=${process.env.PGDATABASE || ""}`;
}

const pool = new Pool(createPoolConfig());

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL pool error:", err);
});

async function initDb() {
  if (!isDbConfigured()) {
    const err = new Error(
      "PostgreSQL is not configured. Set DATABASE_URL (recommended) or PGDATABASE to enable database features."
    );
    err.code = "DB_NOT_CONFIGURED";
    throw err;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } catch (error) {
    if (error && error.code === "3D000") {
      const message = `PostgreSQL database does not exist. Check your .env config (${getDbHint()}). Create the database (or change PGDATABASE/DATABASE_URL to an existing database) and try again.`;
      const wrapped = new Error(message);
      wrapped.cause = error;
      throw wrapped;
    }

    throw error;
  }
}

module.exports = { pool, initDb, isDbConfigured };
