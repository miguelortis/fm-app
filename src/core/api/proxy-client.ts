import axios, { AxiosRequestConfig } from "axios";
import { BaseData } from "./types/proxy-client.interface";

/**
 * Función núcleo que centraliza la comunicación con el Route Handler de Next.js
 */
async function coreProxyRequest<T = BaseData>(
  subRoute: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  data?: BaseData,
  config?: AxiosRequestConfig,
): Promise<T> {
  // 1. 🌟 Saneamos la sub-ruta: Si viene con un "/" al inicio por error (ej: "/auth/logout"), se lo quitamos
  const cleanSubRoute = subRoute.startsWith("/") ? subRoute.slice(1) : subRoute;

  // 2. Aseguramos que el body no sea undefined si es un método de escritura
  const actualData = data || {};

  const payload =
    method !== "GET" ? { ...actualData, _proxyOptions: config } : undefined;

  // 3. Forzamos la URL limpia sin riesgo de doble barra "//"
  const response = await axios({
    url: `/api/proxy/${cleanSubRoute}`,
    method,
    data: payload,
    params: method === "GET" ? config?.params : undefined,
    headers: method === "GET" ? config?.headers : {},
  });

  return response.data as T;
}

/**
 * 🌟 Objeto apiProxy con métodos directos mapeados
 */
export const apiProxy = {
  get: <T = BaseData>(url: string, config?: AxiosRequestConfig) =>
    coreProxyRequest<T>(url, "GET", undefined, config),

  post: <T = BaseData>(
    url: string,
    data?: BaseData,
    config?: AxiosRequestConfig,
  ) => coreProxyRequest<T>(url, "POST", data, config),

  put: <T = BaseData>(
    url: string,
    data?: BaseData,
    config?: AxiosRequestConfig,
  ) => coreProxyRequest<T>(url, "PUT", data, config),

  patch: <T = BaseData>(
    url: string,
    data?: BaseData,
    config?: AxiosRequestConfig,
  ) => coreProxyRequest<T>(url, "PATCH", data, config),

  delete: <T = BaseData>(url: string, config?: AxiosRequestConfig) =>
    coreProxyRequest<T>(url, "DELETE", undefined, config),
};
