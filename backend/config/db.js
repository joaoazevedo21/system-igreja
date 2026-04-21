const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host:"localhost",
    database: "igreja_db",
    password: "Mauricior7",
    port: 5432
});

module.exports=pool;