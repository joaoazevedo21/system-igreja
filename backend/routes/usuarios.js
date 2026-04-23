const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verificarToken = require("../autenticar/auth");

require("dotenv").config();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1,$2,$3,$4) RETURNING *",
      [nome, email, senhaCriptografada, tipo || "lider"]
    );

    res.json(usuario.rows[0]);

  } catch (error) {
    console.error("ERRO REGISTER:", error);

    // 🔥 TRATAMENTO DO EMAIL DUPLICADO
    if (error.code === "23505") {
      return res.status(400).send("Email já existe");
    }

    res.status(500).send("Erro ao cadastrar o usuario");
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).send("Usuário não encontrado");
    }

    const usuarioEncontrado = usuario.rows[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuarioEncontrado.senha
    );

    if (!senhaCorreta) {
      return res.status(400).send("Senha incorreta");
    }

    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        tipo: usuarioEncontrado.tipo
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        tipo: usuarioEncontrado.tipo
      }
    });

  } catch (error) {
    console.error("ERRO LOGIN:", error);
    res.status(500).send("Erro no login");
  }
});


// ================= PERFIL =================
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await pool.query(
      "SELECT id, nome, email, tipo FROM usuarios WHERE id = $1",
      [req.usuarioId]
    );

    res.json(usuario.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar perfil");
  }
});


// ================= DEBUG USERS =================
router.get("/debug-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar usuários");
  }
});


// ================= TESTE DB =================
router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro na conexão com banco");
  }
});

module.exports = router;