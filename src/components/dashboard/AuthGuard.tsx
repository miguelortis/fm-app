"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useCurrentUser } from "@/hooks/auth/useUserMutation";
import { SIDEBAR_NAVIGATION } from "@/core/config/navigation.config";
import { Spinner } from "@heroui/react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser, logout, isHydrated } = useAuthStore();

  const {
    data: currentUser,
    isFetched,
    isLoading: isUserQueryLoading,
    isError,
  } = useCurrentUser();

  // 1. ÚNICO EFECTO: Sincronizar el estado local con la respuesta del servidor (NestJS)
  useEffect(() => {
    if (!isHydrated) return;

    // Si TanStack Query determinó que el token no sirve o la sesión expiró en el servidor
    if ((isFetched && !currentUser) || isError) {
      logout();
      router.replace("/login");
      return;
    }

    // Si vino data fresca y válida del servidor, actualizamos Zustand
    if (currentUser) {
      setUser(currentUser, null);
    }
  }, [isHydrated, currentUser, isFetched, isError, setUser, router, logout]);

  // 2. 🌟 ESTADO DERIVADO CON useMemo: Validamos permisos en tiempo real sin disparar setStates
  const checkAccess = useMemo(() => {
    if (!isHydrated) return { loading: true, allowed: false };

    // Si la query sigue cargando y no tenemos un usuario previo en Zustand, esperamos
    if (isUserQueryLoading && !user) return { loading: true, allowed: false };

    // Si ya terminó de buscar y definitivamente no hay usuario, bloqueamos
    if (isFetched && !currentUser && !user)
      return { loading: false, allowed: false };

    // Evaluamos el usuario disponible (el fresco del servidor o el persistido en Zustand)
    const activeUser = currentUser || user;
    if (!activeUser) return { loading: true, allowed: false };

    // REGLA ROOT: Acceso total garantizado
    if (activeUser.role?.isRoot) return { loading: false, allowed: true };

    // Buscamos si la URL actual en la que está el navegador exige un permiso
    let currentItemRoute = null;
    for (const section of SIDEBAR_NAVIGATION) {
      const matchItem = section.items.find((item) => pathname === item.href);
      if (matchItem) {
        currentItemRoute = matchItem;
        break;
      }
    }

    // Si la ruta requiere un permiso, hacemos el match de los slugs
    if (currentItemRoute?.permission) {
      const userPermissions =
        activeUser.role?.permissions?.map((p: { slug: string }) => p.slug) ||
        [];
      const hasRequiredPermission = userPermissions.includes(
        currentItemRoute.permission,
      );

      if (!hasRequiredPermission) {
        return {
          loading: false,
          allowed: false,
          redirectTo: "/dashboard/unauthorized",
        };
      }
    }

    // Si pasó los filtros o la ruta es pública dentro del dashboard, acceso permitido
    return { loading: false, allowed: true };
  }, [pathname, user, currentUser, isHydrated, isUserQueryLoading, isFetched]);

  // 3. EFECTO DE REDIRECCIÓN SEGURO: Se ejecuta DESPUÉS del renderizado si hace falta desviar al usuario
  useEffect(() => {
    if (
      !checkAccess.loading &&
      !checkAccess.allowed &&
      checkAccess.redirectTo
    ) {
      router.replace(checkAccess.redirectTo);
    }
  }, [checkAccess, router]);

  // 4. CONTROL DE INTERFAZ (Elimina el estancamiento del Loading)
  if (checkAccess.loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50/50">
        <Spinner size="lg" className="text-[#006ae1]" />
        <p className="text-slate-500 font-bold text-sm animate-pulse">
          Verificando credenciales de seguridad...
        </p>
      </div>
    );
  }

  // Si no está permitido y tiene una ruta de redirección activa, no renderizamos nada para evitar parpadeos
  if (!checkAccess.allowed && checkAccess.redirectTo) {
    return null;
  }

  // Si todo está en orden, da el paso libre inmediato a la pantalla
  return <>{children}</>;
}
