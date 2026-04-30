import axios from "axios";

// 🔥 BASE DINÂMICA (LOCAL + PRODUÇÃO)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000"
});

// 🔐 INTERCEPTOR → envia token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ⚠️ INTERCEPTOR DE RESPOSTA (PROFISSIONAL)
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 🔥 LOGOUT AUTOMÁTICO
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;