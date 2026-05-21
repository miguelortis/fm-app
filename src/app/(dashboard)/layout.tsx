"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button, Spinner } from "@heroui/react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/useUserMutation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, setUser, logout, isHydrated } = useAuthStore();
  const {
    data: currentUser,
    isFetched,
    isLoading: isUserQueryLoading,
  } = useCurrentUser();

  useEffect(() => {
    // Si Zustand no se ha hidratado, no tomamos decisiones aún
    if (!isHydrated) return;

    // Si TanStack Query ya buscó en el servidor y determinó que el token no sirve o expiró
    if (isFetched && !currentUser) {
      logout(); // Limpiamos store
      router.push("/login");
      return;
    }

    // Si vino data fresca del servidor, actualizamos Zustand
    if (currentUser) {
      setUser(currentUser, null);
    }
  }, [isHydrated, currentUser, isFetched, setUser, router, logout]);

  if (!isHydrated || (!user && isUserQueryLoading)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Spinner size="lg" className="text-[#006ae1]" />
        <p className="text-slate-500 font-bold text-sm animate-pulse">
          Verificando credenciales de seguridad...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      {/* 1. SIDEBAR PARA ESCRITORIO (Se oculta en móviles con 'hidden lg:flex') */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar user={user} onLogout={logout} />
      </div>

      {/* 2. SIDEBAR FLOTANTE PARA MÓVILES (Usa un backdrop oscuro tras de sí) */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Fondo oscuro traslúcido */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Contenedor del Sidebar con transición de deslizamiento (Slide) */}
        <div
          className={`relative flex w-full max-w-xs flex-1 flex-col bg-white transition-transform duration-300 ease-out shadow-2xl ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Botón interno para cerrar el menú */}
          <div className="absolute right-4 top-4 z-50">
            <Button
              isIconOnly
              variant="outline"
              className="rounded-xl text-slate-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
          <Sidebar user={user} onLogout={logout} />
        </div>
      </div>

      {/* 3. CONTENEDOR PRINCIPAL DE CONTENIDO */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar superior responsiva (Solo visible en pantallas medianas y móviles) */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 lg:hidden shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#006ae1] to-[#00a6a0] flex items-center justify-center text-white font-black text-xs">
              U
            </div>
            <span className="font-black text-sm text-slate-800 tracking-tight">
              UNEFM<span className="text-[#00a6a0]">Salud</span>
            </span>
          </div>

          <Button
            isIconOnly
            variant="outline"
            className="rounded-xl border border-slate-100 bg-slate-50 text-slate-700"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </Button>
        </header>

        {/* El contenido de tus pantallas (/dashboard, /roles, etc) se inyecta aquí */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 py-6 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
