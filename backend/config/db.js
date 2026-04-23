const { Pool } = require("pg");

// 🔥 SE ESTIVER EM PRODUÇÃO (Render / Neon)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

  // 🔥 SENÃO (LOCAL - teu código atual mantido)
  : new Pool({
      user: "postgres",
      host: "localhost",
      database: "igreja_db",
      password: "Mauricior7",
      port: 5432
    });
    

module.exports = pool;