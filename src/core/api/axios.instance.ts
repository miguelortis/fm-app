import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el Token
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Si hay un error antes de enviar la petición, lo rechazamos limpiamente
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores globales (ej: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      //eliminamos la cookie de autenticación (si existiera) para limpiar el estado de autenticación
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirigimos al usuario al login de inmediato
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
