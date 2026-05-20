import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔥 PÁGINAS
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Membros from "./pages/Membros";
import Departamentos from "./pages/Departamentos";
import Usuarios from "./pages/Usuarios";

// 🔥 NOVAS PÁGINAS
import Dizimos from "./pages/Dizimos";
import Financeiro from "./pages/Financeiro";

// 🔥 TOAST
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// ================= 🔐 VALIDAR TOKEN =================
function tokenValido() {

  const token = localStorage.getItem("token");

  if (!token) return false;

  try {

    const payload = JSON.parse(atob(token.split(".")[1]));

    // 🔥 VERIFICA EXPIRAÇÃO
    if (payload.exp * 1000 < Date.now()) {
      localStorage.clear();
      return false;
    }

    return true;

  } catch (error) {

    localStorage.clear();
    return false;

  }
}


// ================= PEGAR USUÁRIO =================
function getUsuario() {

  try {

    const data = localStorage.getItem("usuario");

    if (data && data !== "undefined") {
      return JSON.parse(data);
    }

    return null;

  } catch {

    return null;

  }
}


// ================= ROTAS PRIVADAS =================
function PrivateRoute({ children }) {

  return tokenValido()
    ? children
    : <Navigate to="/" />;

}


// ================= ADMIN =================
function AdminRoute({ children }) {

  const user = getUsuario();

  if (!tokenValido()) {
    return <Navigate to="/" />;
  }

  return user?.tipo === "admin"
    ? children
    : <Navigate to="/dashboard" />;

}


// ================= 🔥 PERMISSÕES DINÂMICAS =================
function PermissaoRoute({ children, roles }) {

  const user = getUsuario();

  if (!tokenValido()) {
    return <Navigate to="/" />;
  }

  // 🔥 SEM PERMISSÃO
  if (!roles.includes(user?.tipo)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}


// ================= APP =================
function App() {

  return (

    <BrowserRouter>

      {/* 🔥 TOAST */}
      <ToastContainer />

      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* MEMBROS */}
        <Route
          path="/membros"
          element={
            <PrivateRoute>
              <PermissaoRoute
                roles={[
                  "admin",
                  "secretario",
                  "lider"
                ]}
              >
                <Membros />
              </PermissaoRoute>
            </PrivateRoute>
          }
        />

        {/* DÍZIMOS */}
        <Route
          path="/dizimos"
          element={
            <PrivateRoute>
              <PermissaoRoute
                roles={[
                  "admin",
                  "tesoureiro"
                ]}
              >
                <Dizimos />
              </PermissaoRoute>
            </PrivateRoute>
          }
        />

        {/* FINANCEIRO */}
        <Route
          path="/financeiro"
          element={
            <PrivateRoute>
              <PermissaoRoute
                roles={[
                  "admin",
                  "tesoureiro"
                ]}
              >
                <Financeiro />
              </PermissaoRoute>
            </PrivateRoute>
          }
        />

        {/* DEPARTAMENTOS */}
        <Route
          path="/departamentos"
          element={
            <PrivateRoute>
              <AdminRoute>
                <Departamentos />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* USUÁRIOS */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <AdminRoute>
                <Usuarios />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* 🔥 USUÁRIO COMUM */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PermissaoRoute
                roles={[
                  "comum",
                  "admin",
                  "lider",
                  "secretario",
                  "tesoureiro"
                ]}
              >
                <Dashboard />
              </PermissaoRoute>
            </PrivateRoute>
          }
        />

        {/* 🔥 ROTA INVÁLIDA */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;