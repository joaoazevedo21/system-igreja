// 🔐 PEGAR USUÁRIO
export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

// 🔐 ADMIN
export function isAdmin() {
  const user = getUsuario();
  return user?.tipo === "admin";
}

// 🔥 NOVOS TIPOS
export function isTesoureiro() {
  const user = getUsuario();
  return user?.tipo === "tesoureiro";
}

export function isSecretario() {
  const user = getUsuario();
  return user?.tipo === "secretario";
}

export function isLider() {
  const user = getUsuario();
  return user?.tipo === "lider";
}

// 🔥 TOKEN
export function getToken() {
  return localStorage.getItem("token");
}

// 🔥 VERIFICAR LOGIN
export function isAuthenticated() {
  return !!getToken();
}

// 🔥 LOGOUT
export function logout() {
  localStorage.clear();
  window.location.href = "/";
}