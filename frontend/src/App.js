import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔥 PÁGINAS
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Membros from "./pages/Membros";
import Departamentos from "./pages/Departamentos";
import Usuarios from "./pages/Usuarios";

// 🔥 TOAST
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// ================= 🔐 VALIDAR TOKEN =================
function tokenValido() {

  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

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


// ================= ROTAS PRIVADAS =================
function PrivateRoute({ children }) {
  return tokenValido()
    ? children
    : <Navigate to="/" />;
}


// ================= ADMIN =================
function AdminRoute({ children }) {

  let user = null;

  try {
    const data = localStorage.getItem("usuario");

    if (data && data !== "undefined") {
      user = JSON.parse(data);
    }

  } catch {
    user = null;
  }

  if (!tokenValido()) {
    return <Navigate to="/" />;
  }

  return user?.tipo === "admin"
    ? children
    : <Navigate to="/dashboard" />;
}


// 🔥 NOVO → PERMISSÕES DINÂMICAS
function PermissaoRoute({ children, roles }) {

  let user = null;

  try {
    const data = localStorage.getItem("usuario");

    if (data && data !== "undefined") {
      user = JSON.parse(data);
    }

  } catch {
    user = null;
  }

  if (!tokenValido()) {
    return <Navigate to="/" />;
  }

  if (!roles.includes(user?.tipo)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}


// ================= APP =================
function App() {

  return (

    <BrowserRouter>

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

        {/* MEMBROS → admin + secretario */}
        <Route
          path="/membros"
          element={
            <PrivateRoute>
              <PermissaoRoute roles={["admin", "secretario"]}>
                <Membros />
              </PermissaoRoute>
            </PrivateRoute>
          }
        />

        {/* DEPARTAMENTOS → admin */}
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

        {/* USUÁRIOS → admin */}
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

        {/* 🔥 ROTA INVÁLIDA */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;