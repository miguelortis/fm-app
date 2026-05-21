import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el Token
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para manejar errores globales (ej: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Aquí podrías redirigir al login o borrar la cookie
      console.error("Sesión expirada");
    }
    return Promise.reject(error);
  },
);

export default api;
