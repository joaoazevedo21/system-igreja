function Header() {

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

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div style={styles.header}>

      <h3>👋 Olá, {user?.nome || "Usuário"}</h3>

      <button onClick={logout} style={styles.btn}>
        Sair
      </button>

    </div>
  );
}

const styles = {
  header: {
    height: "60px",
    background: "#2c3e50",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px"
  },
  btn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Header;