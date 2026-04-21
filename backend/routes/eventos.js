const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");


// criar evento
router.post("/criar", verificarToken, async (req, res) => {

 const { titulo, descricao, data } = req.body;

 try {

  const novoEvento = await pool.query(
   "INSERT INTO eventos (titulo, descricao, data) VALUES ($1,$2,$3) RETURNING *",
   [titulo, descricao, data]
  );

  res.json(novoEvento.rows[0]);

 } catch (error) {

  console.error(error);
  res.status(500).send("Erro ao criar evento");

 }

});


// listar eventos
router.get("/", verificarToken, async (req, res) => {

 try {

  const eventos = await pool.query(
   "SELECT * FROM eventos ORDER BY data ASC"
  );

  res.json(eventos.rows);

 } catch (error) {

  console.error(error);
  res.status(500).send("Erro ao listar eventos");

 }

});


module.exports = router;