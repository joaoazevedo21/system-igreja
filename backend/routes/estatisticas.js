const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");

router.get("/", verificarToken, async (req, res) => {

  try {

    const totalMembros = await pool.query(
      "SELECT COUNT(*) AS total FROM membros"
    );

    const totalDepartamentos = await pool.query(
      "SELECT COUNT(*) AS total FROM departamentos"
    );

    const totalDizimos = await pool.query(
      "SELECT COALESCE(SUM(valor),0) AS total FROM dizimos"
    );

    res.json({
      total_membros: totalMembros.rows[0].total,
      total_departamentos: totalDepartamentos.rows[0].total,
      total_dizimos: totalDizimos.rows[0].total
    });

  } catch (error) {

    console.error("ERRO ESTATISTICAS:", error);
    res.status(500).send("Erro ao buscar estatísticas");

  }

});

module.exports = router;