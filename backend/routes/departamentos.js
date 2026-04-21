const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../autenticar/auth");

router.get("/", verificarToken, async (req, res) => {

 try{

  const departamentos = await pool.query(
   "SELECT * FROM departamentos ORDER BY id ASC"
  );

  res.json(departamentos.rows);

 }catch(error){

  console.error(error);
  res.status(500).send("Erro ao buscar departamentos");

 }

});


module.exports = router;