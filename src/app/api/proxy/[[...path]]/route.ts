import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig, Method, AxiosHeaders } from "axios";

// Instancia base de Axios apuntando fijamente a tu backend en Render/Local
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Interfaz para mapear las opciones extendidas desde el cliente sin caer en any
interface ExtendedAxiosConfig extends AxiosRequestConfig {
  transformRequest?: (data: unknown, headers: AxiosHeaders) => unknown;
  transformResponse?: (data: unknown) => unknown;
}

interface ProxyRequestBody {
  _proxyOptions?: ExtendedAxiosConfig;
  [key: string]: unknown;
}

// Handler unificado para procesar todos los métodos HTTP
async function handleProxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    // 1. Reconstruimos la ruta exacta del backend (ej: auth/login)
    const subRoute = resolvedParams.path ? resolvedParams.path.join("/") : "";
    const targetUrl = `${BACKEND_URL}/${subRoute}`;

    // 2. Extraemos el método HTTP original de la llamada
    const method = request.method as Method;

    // 3. Extraemos los Query Params de la URL original de Next.js
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    // 4. Capturamos el token de la cookie de Next.js (si existe)
    const token = request.cookies.get("auth_token")?.value;

    // 5. Extraemos el cuerpo de la petición (Body) de forma segura
    let body: ProxyRequestBody | null = null;
    if (method !== "GET" && method !== "HEAD") {
      try {
        body = (await request.json()) as ProxyRequestBody;
      } catch {
        body = null;
      }
    }

    // 6. Extraemos las opciones personalizadas y saneamos el body
    const customOptions: ExtendedAxiosConfig = body?._proxyOptions || {};
    let cleanedBody: Record<string, unknown> | null = null;

    if (body) {
      // 🌟 Usamos la exclusión por desestructuración para evitar errores del linter
      const { _proxyOptions: _, ...actualData } = body;
      cleanedBody = actualData;
    }

    // 7. Inicializamos los headers usando la clase oficial de Axios
    const axiosHeaders = new AxiosHeaders({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    // Si vienen headers personalizados del front, los inyectamos de forma segura
    if (customOptions.headers) {
      Object.entries(customOptions.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          axiosHeaders.set(key, String(value));
        }
      });
    }

    const axiosConfig: AxiosRequestConfig = {
      url: targetUrl,
      method: method,
      params: { ...searchParams, ...customOptions.params },
      timeout: customOptions.timeout || 15000,
      responseType: customOptions.responseType || "json",
      validateStatus:
        customOptions.validateStatus ||
        ((status) => status >= 200 && status < 300),
      headers: axiosHeaders,
    };

    if (cleanedBody) {
      axiosConfig.data = cleanedBody;
    }

    // 8. Aplicamos el transformador de petición si fue enviado por el cliente
    if (typeof customOptions.transformRequest === "function") {
      const transformedData = customOptions.transformRequest(
        axiosConfig.data,
        axiosHeaders,
      );
      axiosConfig.data =
        typeof transformedData === "object"
          ? JSON.stringify(transformedData)
          : transformedData;
    }

    // Disparamos la petición real hacia el servidor de Render / Backend
    const response = await axios(axiosConfig);

    let responseData = response.data as Record<string, unknown>;

    // Aplicamos el transformador de respuesta si fue enviado
    if (typeof customOptions.transformResponse === "function") {
      responseData = customOptions.transformResponse(responseData) as Record<
        string,
        unknown
      >;
    }

    // 9. Creamos la respuesta definitiva de Next.js hacia el navegador
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
    });

    // =========================================================================
    // 🔒 CONTROLADOR AUTOMÁTICO DE SESIONES (INTERCEPCIÓN DE COOKIES)
    // =========================================================================

    // CASO LOGIN: Interceptamos la respuesta para incrustar la cookie HttpOnly
    if (
      subRoute === "auth/login" &&
      responseData &&
      typeof responseData === "object"
    ) {
      const sessionToken =
        (responseData as Record<string, unknown>).access_token ||
        (responseData as Record<string, unknown>).token;

      if (sessionToken) {
        nextResponse.cookies.set("auth_token", String(sessionToken), {
          httpOnly: true, // Protege el token de ataques XSS (invisible para js-cookie)
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 8, // 8 horas para coincidir con tu regla de negocio
          path: "/",
        });
      }
    }

    // CASO LOGOUT: Modificamos las cabeceras HTTP para fulminar la cookie al instante
    if (subRoute === "auth/logout") {
      nextResponse.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0, // 🔥 Le dice a Chrome: "Esta cookie expiró, bórrala de inmediato"
        path: "/", // Debe coincidir exactamente con la ruta raíz con la que se creó
      });
    }

    return nextResponse;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("🚨 Error capturado en el Proxy Genérico:", errorMessage);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;
    const errorData = axios.isAxiosError(error)
      ? error.response?.data || { message: "Internal Proxy Error" }
      : { message: "Internal Proxy Error" };

    return NextResponse.json(errorData, { status });
  }
}

// Exportamos el Handler para todos los métodos HTTP que Next.js mapea
export {
  handleProxyRequest as GET,
  handleProxyRequest as POST,
  handleProxyRequest as PUT,
  handleProxyRequest as PATCH,
  handleProxyRequest as DELETE,
};
