const { Pool } = require("pg");

// 🔥 PRODUÇÃO (Render / Neon)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

  // 🔥 LOCAL (teu computador)
  : new Pool({
      user: "postgres",
      host: "localhost",
      database: "igreja_db",
      password: "Mauricior7",
      port: 5432
    });

module.exports = pool;