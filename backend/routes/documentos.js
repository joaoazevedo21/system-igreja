const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");


// criar documento
router.post("/criar", verificarToken, async (req, res) => {

 const { titulo, descricao } = req.body;

 try {

  const novoDocumento = await pool.query(
   "INSERT INTO documentos (titulo, descricao) VALUES ($1,$2) RETURNING *",
   [titulo, descricao]
  );

  res.json(novoDocumento.rows[0]);

 } catch (error) {

  console.error(error);
  res.status(500).send("Erro ao criar documento");

 }

});


// listar documentos
router.get("/", verificarToken, async (req, res) => {

 try {

  const documentos = await pool.query(
   "SELECT * FROM documentos ORDER BY data DESC"
  );

  res.json(documentos.rows);

 } catch (error) {

  console.error(error);
  res.status(500).send("Erro ao listar documentos");

 }

});


module.exports = router;