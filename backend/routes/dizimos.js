const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");
const verificarPermissao = require("../autenticar/permissao");

// ================== CADASTRAR DÍZIMO ==================
router.post(
    "/cadastrar",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        const { valor, departamento_id } = req.body;

        try {
            const novoDizimo = await pool.query(
                "INSERT INTO dizimos (valor, departamento_id) VALUES ($1, $2) RETURNING *",
                [valor, departamento_id]
            );
            res.json(novoDizimo.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao cadastrar dízimo");
        }
    }
);

// ================== LISTAR ==================
router.get(
    "/",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        try {
            const dizimos = await pool.query(
`SELECT 
    dizimos.id,
    dizimos.valor,
    dizimos.data,
    departamentos.nome AS departamento
FROM dizimos
LEFT JOIN departamentos ON dizimos.departamento_id = departamentos.id
ORDER BY dizimos.data DESC`
            );
            res.json(dizimos.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar dízimos");
        }
    }
);

// ================== FILTRO POR DATA (NOVO) ==================
router.get(
    "/filtrar-por-data",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {

        const { inicio, fim } = req.query;

        try {
            const resultado = await pool.query(
                `SELECT * FROM dizimos 
                 WHERE data BETWEEN $1 AND $2
                 ORDER BY data DESC`,
                [inicio, fim]
            );

            res.json(resultado.rows);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao filtrar por data");
        }
    }
);

module.exports = router;