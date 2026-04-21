const express = require ("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verificarToken = require("../autenticar/auth");

// ================= REGISTER =================
router.post("/register", async (req, res)=>{
    const{nome, email, senha, tipo}= req.body;
    try{
        const senhacriptografada= await bcrypt.hash(senha, 10);

        const usuario=await pool.query(
            "INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1,$2,$3,$4) RETURNING *",
            [nome, email, senhacriptografada, tipo || "lider"]
        );

        res.json(usuario.rows[0]);

    } catch(error){
        console.error(error);
        res.status(500).send("Erro ao cadastrar o usuario");
    }
});


// ================= LOGIN (CORRIGIDO) =================
router.post("/login", async(req, res)=>{
    const {email, senha}= req.body;

    try {

        const usuario = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if(usuario.rows.length === 0){
            return res.status(400).send("o usuario que procura nao foi encontrado");
        }

        const usuarioencontrado = usuario.rows[0];

        const senhacorreta = await bcrypt.compare(
            senha,
            usuarioencontrado.senha
        );

        if(!senhacorreta){
            return res.status(400).send("SENHA ESTA INCORRETA");
        }

        const token = jwt.sign({
                id: usuarioencontrado.id,
                tipo: usuarioencontrado.tipo
            },
            "segredo_super",
            {expiresIn: "1h"}
        );

        // 🔥 AQUI FOI A CORREÇÃO
        res.json({
            message:"Login Realizado com sucesso", 
            token: token,
            usuario: {
                id: usuarioencontrado.id,
                nome: usuarioencontrado.nome,
                email: usuarioencontrado.email,
                tipo: usuarioencontrado.tipo
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro no login");
    }
});


// ================= PERFIL =================
router.get("/perfil", verificarToken, async (req, res) => {
    try{

        const usuario = await pool.query(
            "SELECT id, nome, email, tipo FROM usuarios WHERE id = $1",
            [req.usuarioId]
        );

        res.json(usuario.rows[0]);

    }catch(error){
        console.error(error);
        res.status(500).send("Erro ao buscar perfil");
    }
});

module.exports = router;