import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

function Usuarios() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("lider");

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // ================= CADASTRAR =================
  async function cadastrar(e) {
    e.preventDefault();
    setLoading(true);

    try {

      await api.post("/usuarios/register", {
        nome,
        email,
        senha,
        tipo
      });

      setMensagem("✅ Usuário criado com sucesso!");

      setNome("");
      setEmail("");
      setSenha("");
      setTipo("lider");

    } catch (error) {

      console.error(error);
      setMensagem("❌ Erro ao criar usuário");

    }

    setLoading(false);
  }

  return (

    <Layout>

      <div style={styles.container}>

        <h1 style={styles.title}>👤 Gestão de Usuários</h1>

        {/* 🔥 MENSAGEM */}
        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}

        {/* 🔥 FORM */}
        <form onSubmit={cadastrar} style={styles.form}>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={styles.input}
            required
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={styles.input}
          >
            <option value="admin">Admin</option>
            <option value="lider">Líder</option>
            <option value="comum">Comum</option>
          </select>

          <button style={styles.button} disabled={loading}>
            {loading ? "Salvando..." : "Criar Usuário"}
          </button>

        </form>

      </div>

    </Layout>
  );
}

const styles = {

  container: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "10px",
    color: "#2c3e50"
  },

  mensagem: {
    marginBottom: "15px",
    fontWeight: "bold"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "350px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }

};

export default Usuarios;