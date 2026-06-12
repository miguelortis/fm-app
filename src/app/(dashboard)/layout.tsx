"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { AuthGuard } from "@/components/dashboard/AuthGuard";
import { MobileNavigation } from "@/components/dashboard/MobileNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50/50 text-slate-800 antialiased">
        {/* 1. SIDEBAR FIJO EN ESCRITORIO */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar user={user} onLogout={logout} />
        </div>

        {/* 2. NAVEGACIÓN Y MENÚ ADAPTATIVO MÓVIL */}

        {/* 3. CONTENEDOR CENTRAL DE TRABAJO */}
        <div className="flex flex-2 flex-col overflow-hidden">
          <MobileNavigation
            user={user}
            logout={logout}
            isOpen={isMobileMenuOpen}
            setIsOpen={setIsMobileMenuOpen}
          />
          <main className="flex-2 overflow-y-auto bg-slate-50/30 py-6 focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
