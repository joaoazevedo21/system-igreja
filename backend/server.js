require("dotenv").config(); // 🔥 NOVO (variáveis de ambiente)

const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const membrosRoutes = require("./routes/membros");
const departamentosRoutes = require("./routes/departamentos");
const estatisticasRoutes = require("./routes/estatisticas");
const financasRoutes = require("./routes/financas");
const eventosRoutes = require("./routes/eventos");
const avisosRoutes = require("./routes/avisos");
const documentosRoutes = require("./routes/documentos");
const dizimosRoutes = require("./routes/dizimos");
const relatoriosRoutes = require("./routes/relatorios");
const ofertasRoutes = require("./routes/ofertas");

const pool = require("./config/db");

const app = express();


// 🔥 ================= CORS INTELIGENTE =================
const allowedOrigins = [
  "http://localhost:3001", // local frontend
  process.env.FRONTEND_URL // produção (Vercel)
];

app.use(cors({
  origin: function (origin, callback) {
    // permite chamadas tipo Postman / sem origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS bloqueado"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// 🔥 ================= MIDDLEWARE =================
app.use(express.json());


// 🔥 ================= ROTAS =================
app.use("/usuarios", usuariosRoutes);
app.use("/membros", membrosRoutes);
app.use("/departamentos", departamentosRoutes);
app.use("/estatisticas", estatisticasRoutes);
app.use("/financas", financasRoutes);
app.use("/eventos", eventosRoutes);
app.use("/avisos", avisosRoutes);
app.use("/documentos", documentosRoutes);
app.use("/dizimos", dizimosRoutes);
app.use("/relatorios", relatoriosRoutes);
app.use("/ofertas", ofertasRoutes);


// 🔥 ================= ROTA BASE =================
app.get("/", (req, res) => {
  res.send("API Sistema de Gestão de Igrejas Funcionando...");
});


// 🔥 ================= TESTE BANCO =================
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro na conexão com o banco");
  }
});


// 🔥 ================= PORTA DINÂMICA =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});