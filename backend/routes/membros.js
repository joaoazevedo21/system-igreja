const express = require("express");
const router = express.Router(); // 🔥 ISTO ESTAVA FALTANDO

const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");
const verificarPermissao = require("../autenticar/permissao");

// ================== CADASTRAR MEMBRO ==================
router.post(
    "/cadastrar",
    verificarToken,
    verificarPermissao(["admin","lider"]),
    async (req, res) => {

        const { nome, email, telefone, endereco, departamento_id } = req.body;

        try {

            const novoMembro = await pool.query(
                `INSERT INTO membros 
                (nome, email, telefone, endereco, departamento_id) 
                VALUES ($1,$2,$3,$4,$5) RETURNING *`,
                [nome, email, telefone, endereco, departamento_id]
            );

            res.json(novoMembro.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao cadastrar membro");
        }
    }
);

// ================== LISTAR MEMBROS ==================
router.get(
    "/",
    verificarToken,
    verificarPermissao(["admin","lider"]),
    async (req, res) => {

        try {

            const membros = await pool.query(
`SELECT 
membros.id,
membros.nome,
membros.email,
membros.telefone,
membros.endereco,
departamentos.nome AS departamento
FROM membros
LEFT JOIN departamentos
ON membros.departamento_id = departamentos.id
ORDER BY membros.id ASC`
            );

            res.json(membros.rows);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar membros");
        }
    }
);

// ================== ATUALIZAR ==================
router.put(
    "/atualizar/:id",
    verificarToken,
    verificarPermissao(["admin","lider"]),
    async (req, res) => {

        const { id } = req.params;
        const { nome, email, telefone, endereco, departamento_id } = req.body;

        try {

            const result = await pool.query(
                `UPDATE membros 
                 SET nome=$1, email=$2, telefone=$3, endereco=$4, departamento_id=$5
                 WHERE id=$6 RETURNING *`,
                [nome, email, telefone, endereco, departamento_id, id]
            );

            res.json(result.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao atualizar membro");
        }
    }
);

// ================== DELETAR ==================
router.delete(
    "/deletar/:id",
    verificarToken,
    verificarPermissao(["admin"]),
    async (req, res) => {

        const { id } = req.params;

        try {

            await pool.query("DELETE FROM membros WHERE id=$1", [id]);

            res.json({ message: "Membro deletado com sucesso" });

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao deletar membro");
        }
    }
);

// ================== PESQUISA AVANÇADA ==================
router.get(
    "/pesquisa-avancada",
    verificarToken,
    verificarPermissao(["admin","lider"]),
    async (req, res) => {

        const { nome, email, departamento } = req.query;

        try {

            const resultado = await pool.query(
`SELECT 
membros.id,
membros.nome,
membros.email,
departamentos.nome AS departamento
FROM membros
LEFT JOIN departamentos
ON membros.departamento_id = departamentos.id
WHERE 
($1::text IS NULL OR membros.nome ILIKE '%' || $1 || '%')
AND
($2::text IS NULL OR membros.email ILIKE '%' || $2 || '%')
AND
($3::int IS NULL OR membros.departamento_id = $3)
ORDER BY membros.id ASC`,
                [nome || null, email || null, departamento || null]
            );

            res.json(resultado.rows);

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro na pesquisa");
        }
    }
);

module.exports = router;