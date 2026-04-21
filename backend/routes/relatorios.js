const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");
const verificarPermissao = require("../autenticar/permissao");

// 🔥 CORS LOCAL (GARANTE FUNCIONAMENTO)
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});


// ================== DÍZIMOS POR DEPARTAMENTO (COM FILTRO DATA) ==================
router.get(
    "/dizimos-por-departamento",
    verificarToken,
    verificarPermissao(["admin"]),
    async (req, res) => {

        const { inicio, fim } = req.query;

        try {

            let query = `
                SELECT 
                    d.nome AS departamento, 
                    SUM(z.valor) AS total_dizimos
                FROM dizimos z
                LEFT JOIN departamentos d ON z.departamento_id = d.id
            `;

            let params = [];

            // 🔥 FILTRO POR DATA (NOVO)
            if (inicio && fim) {
                query += " WHERE z.data BETWEEN $1 AND $2 ";
                params = [inicio, fim];
            }

            query += `
                GROUP BY d.nome
                ORDER BY d.nome ASC
            `;

            const resultado = await pool.query(query, params);

            res.json(resultado.rows);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao gerar relatório de dízimos por departamento");
        }
    }
);


// ================== TOTAL GERAL DE DÍZIMOS ==================
router.get(
    "/total-dizimos",
    verificarToken,
    verificarPermissao(["admin"]),
    async (req, res) => {
        try {
            const resultado = await pool.query(
                "SELECT SUM(valor) AS total_geral FROM dizimos"
            );

            res.json(resultado.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao calcular total geral de dízimos");
        }
    }
);


// ================== MEMBROS POR DEPARTAMENTO ==================
router.get(
    "/membros-por-departamento",
    verificarToken,
    verificarPermissao(["admin"]),
    async (req, res) => {
        try {
            const resultado = await pool.query(
`SELECT 
    d.nome AS departamento, 
    COUNT(m.id) AS total_membros
FROM membros m
LEFT JOIN departamentos d ON m.departamento_id = d.id
GROUP BY d.nome
ORDER BY d.nome ASC`
            );

            res.json(resultado.rows);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao gerar relatório de membros por departamento");
        }
    }
);

module.exports = router;