const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");


// criar aviso
router.post("/criar", verificarToken, async (req, res) => {

 const { titulo, mensagem } = req.body;

 try {

  const novoAviso = await pool.query(
   "INSERT INTO avisos (titulo, mensagem) VALUES ($1,$2) RETURNING *",
   [titulo, mensagem]
  );

  res.json(novoAviso.rows[0]);

 } catch (error) {

  console.error(error);
  res.status(500).send("Erro ao criar aviso");

 }

});


// listar avisos
router.get("/", verificarToken, async (req, res) => {

 try {

  const avisos = await pool.query(
   "SELECT * FROM avisos ORDER BY data DESC"
  );

  res.json(avisos.rows);

 } catch (error) {

  console.error(error);
  res.status(500).send("Erro ao listar avisos");

 }

});


module.exports = router;