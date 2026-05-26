import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const location = useLocation();
  const [aberto, setAberto] = useState(false);

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
      <button onClick={() => setAberto(!aberto)} style={styles.menuBtn}>
        ☰
      </button>

      <div style={{
        ...styles.sidebar,
        left: aberto ? "0" : "-220px"
      }}>

        <h2 style={styles.logo}>⚙ Opções</h2>

        {/* 🔥 TODOS */}
        <Link
          to="/dashboard"
          style={{ ...styles.link, ...ativo("/dashboard") }}
        >
          🏠 Home
        </Link>

        {/* ================================================= */}
        {/* 🔥 ADMIN */}
        {/* ================================================= */}
        {user?.tipo === "admin" && (
          <>

            <Link
              to="/membros"
              style={{ ...styles.link, ...ativo("/membros") }}
            >
              👥 Membros
            </Link>

            <Link
              to="/departamentos"
              style={{ ...styles.link, ...ativo("/departamentos") }}
            >
              📁 Departamentos
            </Link>

            <Link
              to="/usuarios"
              style={{ ...styles.link, ...ativo("/usuarios") }}
            >
              👤 Usuários
            </Link>

            {/* 🔥 ALTERADO */}
            <Link
              to="/financeiro"
              style={{ ...styles.link, ...ativo("/financeiro") }}
            >
              💰 Finanças
            </Link>

            <Link
              to="/dizimos"
              style={{ ...styles.link, ...ativo("/dizimos") }}
            >
              💵 Dízimos
            </Link>

            <Link
              to="/ofertas"
              style={{ ...styles.link, ...ativo("/ofertas") }}
            >
              🎁 Ofertas
            </Link>

            <Link
              to="/eventos"
              style={{ ...styles.link, ...ativo("/eventos") }}
            >
              📅 Eventos
            </Link>

            <Link
              to="/avisos"
              style={{ ...styles.link, ...ativo("/avisos") }}
            >
              📢 Avisos
            </Link>

            <Link
              to="/relatorios"
              style={{ ...styles.link, ...ativo("/relatorios") }}
            >
              📊 Relatórios
            </Link>

          </>
        )}

        {/* ================================================= */}
        {/* 🔥 SECRETARIO */}
        {/* ================================================= */}
        {user?.tipo === "secretario" && (
          <>

            <Link
              to="/membros"
              style={{ ...styles.link, ...ativo("/membros") }}
            >
              👥 Membros
            </Link>

            <Link
              to="/eventos"
              style={{ ...styles.link, ...ativo("/eventos") }}
            >
              📅 Eventos
            </Link>

            <Link
              to="/avisos"
              style={{ ...styles.link, ...ativo("/avisos") }}
            >
              📢 Avisos
            </Link>

            <Link
              to="/relatorios"
              style={{ ...styles.link, ...ativo("/relatorios") }}
            >
              📊 Relatórios
            </Link>

          </>
        )}

        {/* ================================================= */}
        {/* 🔥 TESOUREIRO */}
        {/* ================================================= */}
        {user?.tipo === "tesoureiro" && (
          <>

            {/* 🔥 ALTERADO */}
            <Link
              to="/financeiro"
              style={{ ...styles.link, ...ativo("/financeiro") }}
            >
              💰 Finanças
            </Link>

            <Link
              to="/dizimos"
              style={{ ...styles.link, ...ativo("/dizimos") }}
            >
              💵 Dízimos
            </Link>

            <Link
              to="/ofertas"
              style={{ ...styles.link, ...ativo("/ofertas") }}
            >
              🎁 Ofertas
            </Link>

            <Link
              to="/relatorios"
              style={{ ...styles.link, ...ativo("/relatorios") }}
            >
              📊 Relatórios
            </Link>

          </>
        )}

        {/* ================================================= */}
        {/* 🔥 LIDER */}
        {/* ================================================= */}
        {user?.tipo === "lider" && (
          <>

            <Link
              to="/membros"
              style={{ ...styles.link, ...ativo("/membros") }}
            >
              👥 Membros
            </Link>

            <Link
              to="/dashboard"
              style={{ ...styles.link, ...ativo("/dashboard") }}
            >
              📊 Painel
            </Link>

          </>
        )}

        {/* ================================================= */}
        {/* 🔥 USUÁRIO COMUM */}
        {/* ================================================= */}
        {user?.tipo === "comum" && (
          <>

            <Link
              to="/dashboard"
              style={{ ...styles.link, ...ativo("/dashboard") }}
            >
              📊 Painel
            </Link>

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
    width: "220px",
    height: "100vh",
    background: "#1e272e",
    color: "#fff",
    padding: "20px",
    position: "fixed",
    top: 0,
    transition: "0.3s",
    overflowY: "auto"
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