import Sidebar from "./Sidebar";
import Header from "./Header";

// 🔥 NOVO
import { getUsuario, logout } from "../utils/auth";

function Layout({ children }) {

  const usuario = getUsuario(); // 🔥 NOVO

  return (

    <div>

      <Sidebar />

      <div style={styles.main}>

        <Header />

        {/* 🔥 NOVO → INFO USUÁRIO + LOGOUT */}
        <div style={styles.topBar}>
          <span>👤 {usuario?.nome}</span>
          <button onClick={logout} style={styles.logout}>
            🚪 Sair
          </button>
        </div>

        <div style={styles.content}>
          {children}
        </div>

      </div>

    </div>

  );

}

const styles = {

  main: {
    marginLeft: "0px"
  },

  // 🔥 NOVO
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#fff",
    borderBottom: "1px solid #ddd"
  },

  content: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  // 🔥 NOVO
  logout: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }

};

export default Layout;