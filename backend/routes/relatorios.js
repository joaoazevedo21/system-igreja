const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");
const verificarPermissao = require("../autenticar/permissao");

// 🔥 CORS LOCAL
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});


// ================== DÍZIMOS POR DEPARTAMENTO ==================
router.get("/dizimos-por-departamento", verificarToken, verificarPermissao(["admin"]), async (req, res) => {

    const { inicio, fim } = req.query;

    try {

        let query = `
            SELECT 
                COALESCE(d.nome, 'Sem departamento') AS departamento, 
                COALESCE(SUM(z.valor),0) AS total_dizimos
            FROM dizimos z
            LEFT JOIN departamentos d ON z.departamento_id = d.id
        `;

        let params = [];

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
        res.status(500).send("Erro ao gerar relatório de dízimos");
    }
});


// ================== TOTAL DÍZIMOS ==================
router.get("/total-dizimos", verificarToken, verificarPermissao(["admin"]), async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT COALESCE(SUM(valor),0) AS total_geral FROM dizimos"
        );

        res.json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro total dízimos");
    }
});


// ================== MEMBROS POR DEPARTAMENTO ==================
router.get("/membros-por-departamento", verificarToken, verificarPermissao(["admin"]), async (req, res) => {
    try {

        const resultado = await pool.query(`
            SELECT 
                COALESCE(d.nome, 'Sem departamento') AS departamento, 
                COUNT(m.id) AS total_membros
            FROM membros m
            LEFT JOIN departamentos d ON m.departamento_id = d.id
            GROUP BY d.nome
            ORDER BY d.nome ASC
        `);

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro membros por departamento");
    }
});


// ================== CRESCIMENTO MENSAL ==================
router.get("/crescimento-mensal", verificarToken, async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT 
                TO_CHAR(data_entrada, 'YYYY-MM') AS mes,
                COUNT(*) AS total
            FROM membros
            GROUP BY mes
            ORDER BY mes
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro crescimento mensal");
    }
});


// ================== ATIVOS VS INATIVOS ==================
router.get("/membros-status", verificarToken, async (req, res) => {
    try {

        const ativos = await pool.query(
            "SELECT COUNT(*) FROM membros WHERE ativo = true"
        );

        const inativos = await pool.query(
            "SELECT COUNT(*) FROM membros WHERE ativo = false"
        );

        res.json({
            ativos: ativos.rows[0].count,
            inativos: inativos.rows[0].count
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro status membros");
    }
});


// ================== RANKING ==================
router.get("/ranking-departamentos", verificarToken, async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT 
                d.nome AS departamento,
                COUNT(m.id) AS total
            FROM departamentos d
            LEFT JOIN membros m ON m.departamento_id = d.id
            GROUP BY d.nome
            ORDER BY total DESC
            LIMIT 5
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ranking");
    }
});

module.exports = router;