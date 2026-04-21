const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");
const verificarPermissao = require("../autenticar/permissao"); // importando middleware

// ================== CADASTRAR OFERTA ==================
router.post(
    "/cadastrar",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        const { valor, departamento_id } = req.body;

        try {
            const novaOferta = await pool.query(
                "INSERT INTO ofertas (valor, departamento_id) VALUES ($1,$2) RETURNING *",
                [valor, departamento_id]
            );
            res.json(novaOferta.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao cadastrar oferta");
        }
    }
);

// ================== LISTAR TODAS OFERTAS ==================
router.get(
    "/",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        try {
            const ofertas = await pool.query(
`SELECT 
ofertas.id,
ofertas.valor,
ofertas.data,
departamentos.nome AS departamento
FROM ofertas
LEFT JOIN departamentos
ON ofertas.departamento_id = departamentos.id
ORDER BY ofertas.data DESC`
            );
            res.json(ofertas.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar ofertas");
        }
    }
);

// ================== BUSCAR OFERTAS POR DEPARTAMENTO ==================
router.get(
    "/departamento/:id",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        const { id } = req.params;

        try {
            const ofertas = await pool.query(
                "SELECT * FROM ofertas WHERE departamento_id = $1 ORDER BY data DESC",
                [id]
            );
            res.json(ofertas.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao buscar ofertas");
        }
    }
);

// ================== BUSCAR UMA OFERTA POR ID ==================
router.get(
    "/:id",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        const { id } = req.params;

        try {
            const oferta = await pool.query(
                "SELECT * FROM ofertas WHERE id = $1",
                [id]
            );
            if (oferta.rows.length === 0) return res.status(404).send("Oferta não encontrada");
            res.json(oferta.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao buscar oferta");
        }
    }
);

// ================== ATUALIZAR OFERTA ==================
router.put(
    "/atualizar/:id",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        const { id } = req.params;
        const { valor, departamento_id } = req.body;

        try {
            const ofertaAtualizada = await pool.query(
                "UPDATE ofertas SET valor=$1, departamento_id=$2 WHERE id=$3 RETURNING *",
                [valor, departamento_id, id]
            );
            if (ofertaAtualizada.rows.length === 0) return res.status(404).send("Oferta não encontrada");
            res.json(ofertaAtualizada.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao atualizar oferta");
        }
    }
);

// ================== DELETAR OFERTA ==================
router.delete(
    "/deletar/:id",
    verificarToken,
    verificarPermissao(["admin","tesoureiro"]),
    async (req, res) => {
        const { id } = req.params;

        try {
            const deletar = await pool.query(
                "DELETE FROM ofertas WHERE id=$1 RETURNING *",
                [id]
            );
            if (deletar.rows.length === 0) return res.status(404).send("Oferta não encontrada");
            res.json({ message: "Oferta deletada com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao deletar oferta");
        }
    }
);

module.exports = router;