export function getUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

export function isAdmin() {
  const user = getUsuario();
  return user?.tipo === "admin";
}

// 🔥 NOVO → pegar token
export function getToken() {
  return localStorage.getItem("token");
}

// 🔥 NOVO → verificar se está logado
export function isAuthenticated() {
  return !!getToken();
}

// 🔥 NOVO → logout
export function logout() {
  localStorage.clear();
  window.location.href = "/";
}