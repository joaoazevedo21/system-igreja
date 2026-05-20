// ================= PEGAR USUÁRIO =================
export function getUsuario() {

  try {

    const usuario = localStorage.getItem("usuario");

    if (!usuario || usuario === "undefined") {
      return null;
    }

    return JSON.parse(usuario);

  } catch (error) {

    console.error("Erro ao pegar usuário:", error);
    return null;

  }
}


// ================= PEGAR TOKEN =================
export function getToken() {
  return localStorage.getItem("token");
}


// ================= VALIDAR TOKEN =================
export function tokenValido() {

  const token = getToken();

  if (!token) {
    return false;
  }

  try {

    // 🔥 PEGA PAYLOAD JWT
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    // 🔥 VERIFICA EXPIRAÇÃO
    if (payload.exp * 1000 < Date.now()) {

      logout();
      return false;

    }

    return true;

  } catch (error) {

    console.error("Token inválido:", error);

    logout();
    return false;

  }
}


// ================= VERIFICAR LOGIN =================
export function isAuthenticated() {
  return tokenValido();
}


// ================= LOGOUT =================
export function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "/";

}


// ================= ADMIN =================
export function isAdmin() {

  const user = getUsuario();

  return user?.tipo === "admin";

}


// ================= LIDER =================
export function isLider() {

  const user = getUsuario();

  return user?.tipo === "lider";

}


// ================= SECRETARIO =================
export function isSecretario() {

  const user = getUsuario();

  return user?.tipo === "secretario";

}


// ================= TESOUREIRO =================
export function isTesoureiro() {

  const user = getUsuario();

  return user?.tipo === "tesoureiro";

}


// ================= USUÁRIO COMUM =================
export function isComum() {

  const user = getUsuario();

  return user?.tipo === "comum";

}