import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const location = useLocation();
  const [aberto, setAberto] = useState(false);

  // 🔥 pegar usuário com segurança
  let user = null;

  try {
    const usuarioString = localStorage.getItem("usuario");

    if (usuarioString && usuarioString !== "undefined") {
      user = JSON.parse(usuarioString);
    }

  } catch (error) {
    console.error("Erro ao ler usuário:", error);
    user = null;
  }

  function ativo(path) {
    return location.pathname === path ? styles.active : {};
  }

  return (

    <>
      {/* BOTÃO MOBILE */}
      <button onClick={() => setAberto(!aberto)} style={styles.menuBtn}>
        ☰
      </button>

      <div style={{
        ...styles.sidebar,
        left: aberto ? "0" : "-220px"
      }}>

        <h2 style={styles.logo}>⚙ Opções</h2>

        {/* 🔥 TODOS VEEM */}
        <Link to="/dashboard" style={{ ...styles.link, ...ativo("/dashboard") }}>
          🏠 Home
        </Link>

        <Link to="/membros" style={{ ...styles.link, ...ativo("/membros") }}>
          👥 Membros
        </Link>

        {/* 🔥 ADMIN */}
        {user?.tipo === "admin" && (
          <>
            <Link to="/departamentos" style={{ ...styles.link, ...ativo("/departamentos") }}>
              📁 Departamentos
            </Link>

            <Link to="/usuarios" style={{ ...styles.link, ...ativo("/usuarios") }}>
              👤 Usuários
            </Link>
          </>
        )}

        {/* 🔥 LIDER (opcional - se quiser expandir depois) */}
        {user?.tipo === "lider" && (
          <>
            {/* espaço para futuras permissões */}
          </>
        )}

      </div>
    </>
  );

}

const styles = {

  menuBtn: {
    position: "fixed",
    top: "10px",
    left: "10px",
    zIndex: 1000,
    padding: "10px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  sidebar: {
    width: "180px",
    height: "100vh",
    background: "#1e272e",
    color: "#fff",
    padding: "20px",
    position: "fixed",
    top: 0,
    transition: "0.3s"
  },

  logo: {
    marginBottom: "20px"
  },

  link: {
    display: "block",
    padding: "10px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    marginBottom: "10px"
  },

  active: {
    background: "#27ae60"
  }

};

export default Sidebar;