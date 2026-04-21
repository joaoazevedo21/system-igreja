const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");

router.get("/", verificarToken, async (req, res) => {

  try {

    const totalMembros = await pool.query(
      "SELECT COUNT(*) FROM membros"
    );

    const totalDepartamentos = await pool.query(
      "SELECT COUNT(*) FROM departamentos"
    );

    const totalDizimos = await pool.query(
      "SELECT COALESCE(SUM(valor),0) FROM dizimos"
    );

    res.json({
      total_membros: totalMembros.rows[0].count,
      total_departamentos: totalDepartamentos.rows[0].count,
      total_dizimos: totalDizimos.rows[0].coalesce
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Erro ao buscar estatísticas");

  }

});

module.exports = router;