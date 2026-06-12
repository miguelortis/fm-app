import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  // 1. Capturamos la cookie de forma nativa en el servidor
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Si el usuario ya está logueado e intenta ir a Login/Register, lo mandamos al Dashboard
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Si el usuario NO está logueado e intenta forzar el Dashboard, lo rebotamos al Login
  if (!token && pathname.startsWith("/dashboard")) {
    const url = new URL("/login", request.url);
    // Guardamos la ruta a la que intentaba entrar para redirigirlo luego del login
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // En cualquier otro caso (peticiones públicas, assets o accesos válidos), permitimos el paso
  return NextResponse.next();
}

// Bloqueamos/Filtramos todas las rutas excepto archivos estáticos, imágenes y las rutas internas de la API Proxy
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
