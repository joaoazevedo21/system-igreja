import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function fazerLogin(e) {

    e.preventDefault();
    setLoading(true);

    try {

      const response = await api.post("/usuarios/login", {
        email,
        senha
      });

      // 🔥 salva token
      localStorage.setItem("token", response.data.token);

      // 🔥 CORRIGIDO: salva usuário
      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data.usuario)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Email ou senha incorretos");
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>Sistema de Gestão de Igreja</h2>

        <form onSubmit={fazerLogin}>

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <div style={styles.passwordBox}>

            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.inputSenha}
              required
            />

            <span
              style={styles.verSenha}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? "🙈" : "👁"}
            </span>

          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#000000,#1c1c1c)"
  },
  card: {
    background: "#ffffff",
    padding: "45px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.5)"
  },
  title: {
    marginBottom: "20px"
  },
  input: {
    width: "93%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "15px"
  },
  inputSenha: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none"
  },
  verSenha: {
    padding: "10px",
    cursor: "pointer"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,#ff7b00,#ffae00)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Login;