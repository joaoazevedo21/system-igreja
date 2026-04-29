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


// ================= 🔐 FUNÇÃO VALIDAR TOKEN =================
function tokenValido() {

  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 🔥 verifica expiração
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


// ================= ROTAS ADMIN =================
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

  // 🔥 valida token + tipo
  if (!tokenValido()) {
    return <Navigate to="/" />;
  }

  return user?.tipo === "admin"
    ? children
    : <Navigate to="/dashboard" />;
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

        {/* MEMBROS */}
        <Route
          path="/membros"
          element={
            <PrivateRoute>
              <Membros />
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

        {/* 🔥 ROTA INVÁLIDA */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;