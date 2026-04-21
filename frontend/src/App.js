import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔥 PÁGINAS
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Membros from "./pages/Membros";
import Departamentos from "./pages/Departamentos";
import Usuarios from "./pages/Usuarios";

// 🔥 TOAST NOTIFICATIONS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// ================= ROTAS PRIVADAS =================
function PrivateRoute({ children }) {

  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
}


// ================= ROTAS ADMIN (MELHORADO) =================
function AdminRoute({ children }) {

  let user = null;

  try {
    const data = localStorage.getItem("usuario");
    if (data && data !== "undefined") {
      user = JSON.parse(data);
    }
  } catch (error) {
    user = null;
  }

  return user?.tipo === "admin"
    ? children
    : <Navigate to="/dashboard" />;
}


// ================= APP =================
function App() {

  return (

    <BrowserRouter>

      {/* 🔥 NOTIFICAÇÕES GLOBAIS */}
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

        {/* DEPARTAMENTOS (ADMIN) */}
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

        {/* USUÁRIOS (ADMIN) */}
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

        {/* 🔥 ROTAS INVÁLIDAS */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;