const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");


// registrar contribuição
router.post("/registrar", verificarToken, async (req, res) => {

    const { tipo, valor } = req.body;

    try{

        const novaContribuicao = await pool.query(
            "INSERT INTO financas (tipo, valor) VALUES ($1,$2) RETURNING *",
            [tipo, valor]
        );

        res.json(novaContribuicao.rows[0]);

    }catch(error){

        console.error(error);
        res.status(500).send("Erro ao registrar contribuição");

    }

});


// listar todas contribuições
router.get("/", verificarToken, async (req, res) => {

    try{

        const financas = await pool.query(
            "SELECT * FROM financas ORDER BY id DESC"
        );

        res.json(financas.rows);

    }catch(error){

        console.error(error);
        res.status(500).send("Erro ao buscar finanças");

    }

});


// total de valores
router.get("/total", verificarToken, async (req, res) => {

    try{

        const total = await pool.query(
            "SELECT SUM(valor) FROM financas"
        );

        res.json({
            total_contribuicoes: total.rows[0].sum
        });

    }catch(error){

        console.error(error);
        res.status(500).send("Erro ao calcular total");

    }

});


module.exports = router;