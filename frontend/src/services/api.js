import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
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

// ⚠️ INTERCEPTOR DE RESPOSTA (opcional mas profissional)
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 🔥 Se token expirar ou der erro 401
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;