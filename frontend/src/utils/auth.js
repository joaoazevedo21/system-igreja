export function getUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

export function isAdmin() {
  const user = getUsuario();
  return user?.tipo === "admin";
}