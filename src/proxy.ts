import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  email: string;
  status: "pending" | "processing" | "refused" | "active";
  roleSlug: string;
}

const authRoutes = ["/login", "/register", "/forgot-password"];
const TARGET_PAGE = "/dashboard/profile/family_members";
const PROCESSING_PAGE = "/dashboard/profile/processing_request";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Control de rutas de autenticación públicas
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Control estricto de Dashboard para no autenticados
  if (!token && pathname.startsWith("/dashboard")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 3. 🌟 FILTRO POR STATUS DEL TOKEN (PENDING / PROCESSING / REFUSED)
  if (token && pathname.startsWith("/dashboard")) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userStatus = decoded.status;

      // Si es SuperAdmin ROOT, omitimos las restricciones de nómina
      if (decoded.roleSlug === "root" || decoded.roleSlug === "admin-root") {
        return NextResponse.next();
      }

      // CASO A: Si está pendiente o rechazado, forzar obligatoriamente la pantalla de carga familiar
      if (
        (userStatus === "pending" || userStatus === "refused") &&
        pathname !== TARGET_PAGE
      ) {
        return NextResponse.redirect(new URL(TARGET_PAGE, request.url));
      }

      // CASO B: Si su expediente está en revisión, mandarlo a la pantalla de procesamiento estática
      if (userStatus === "processing" && pathname !== PROCESSING_PAGE) {
        return NextResponse.redirect(new URL(PROCESSING_PAGE, request.url));
      }

      // CASO C: Si está activo pero intenta entrar a las pantallas de carga familiar previas, mandarlo al home del dashboard
      if (
        userStatus === "active" &&
        (pathname === TARGET_PAGE || pathname === PROCESSING_PAGE)
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Token corrupto o inválido, borramos y rebotamos
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
