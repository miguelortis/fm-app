import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { SIDEBAR_NAVIGATION } from "./core/config/navigation.config";
import { deleteCookie } from "cookies-next";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  isRoot: boolean;
  permissions: string[];
  sub: string;
}

const authRoutes = ["/login", "/register", "/forgot-password"];

// Nota: Next.js ahora mapea la función por defecto o bajo el nombre del nuevo estándar
export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Control de rutas de Auth
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && !pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // 2. Bloqueo global al Dashboard sin sesión
  if (!token && pathname.startsWith("/dashboard")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Control estricto de permisos atómicos
  if (token && pathname.startsWith("/dashboard")) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded?.isRoot) {
        return NextResponse.next();
      }
      let currentItemRoute = null;
      let currentSectionRoute = null;

      for (const section of SIDEBAR_NAVIGATION) {
        const matchItem = section.items.find((item) => pathname === item.href);
        if (matchItem) {
          currentItemRoute = matchItem;
          currentSectionRoute = section;
          break;
        }
      }

      console.log("permisi::", currentItemRoute);
      if (currentItemRoute) {
        /* console.log(decoded);
        const hasRoleAccess = currentSectionRoute.allowedRoles.includes(
          decoded?.role?.name,
        );
        if (!hasRoleAccess) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } */
        if (currentItemRoute.permission) {
          const hasPermissionAccess = decoded?.permissions?.includes(
            currentItemRoute.permission,
          );
          if (!hasPermissionAccess) {
            return NextResponse.redirect(
              new URL("/dashboard/unauthorized", request.url),
            );
          }
        }
      }
    } catch (error) {
      deleteCookie("auth_token");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

// El matcher se queda igual para capturar las rutas del panel
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
