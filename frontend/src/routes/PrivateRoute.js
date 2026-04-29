import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const token = localStorage.getItem("token");

  // 🔐 se não tiver token → volta pro login
  if (!token) {
    return <Navigate to="/" />;
  }

  // 🔓 se tiver token → entra
  return children;
}

export default PrivateRoute;