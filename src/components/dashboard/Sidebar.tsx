"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SIDEBAR_NAVIGATION } from "@/core/config/navigation.config";
import { Separator } from "@heroui/react";
import { LogOut } from "lucide-react";
import { IUser } from "@/types/api";

interface SidebarProps {
  user: IUser | null;
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const permissions = user?.role?.permissions?.map((p) => p.slug);
  // FILTRADO DINÁMICO REFACTORIZADO 100% A PERMISOS
  const visibleNavigation = SIDEBAR_NAVIGATION.map((section) => {
    // 1. Filtramos los ítems individuales a los que el usuario tiene acceso
    const allowedItems = section.items.filter(
      (item) =>
        !item.permission ||
        permissions?.includes(item.permission) ||
        user?.isRoot,
    );

    return {
      ...section,
      items: allowedItems,
    };
  }).filter((section) => {
    // 2. La sección es visible solo si:
    // - El usuario es ROOT
    // - O la sección no exige permisos de entrada ([] o pública)
    // - O el usuario cuenta con al menos uno de los permisos exigidos por la sección macro
    const hasSectionPermission =
      section.requiredPermissions.length === 0 ||
      section.requiredPermissions.some((perm) => permissions?.includes(perm));

    return (user?.isRoot || hasSectionPermission) && section.items.length > 0;
  });

  return (
    <aside className="w-68 h-screen bg-white border-r border-slate-100 flex flex-col justify-between p-6 select-none shadow-[10px_0_30px_-15px_rgba(0,0,0,0.02)]">
      <div className="space-y-8">
        {/* Brand / Logo corporativo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#006ae1] to-[#00a6a0] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#006ae1]/20">
            U
          </div>
          <span className="font-black text-lg text-slate-800 tracking-tight">
            UNEFM<span className="text-[#00a6a0]">Salud</span>
          </span>
        </div>

        {/* Tarjeta de Contexto de Usuario Dinámica */}
        <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-2xl flex flex-col gap-1">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Sesión Activa
          </p>
          <p className="text-sm font-black text-slate-800 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <span className="inline-block text-[10px] w-fit px-2 py-0.5 mt-1 font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-[#006ae1]/10 to-[#00a6a0]/10 text-[#006ae1]">
            {user?.role?.name || "Usuario"}
          </span>
        </div>

        {/* Renderizado del Menú Seguro */}
        <nav className="space-y-6">
          {visibleNavigation.map((section) => (
            <div key={section.sectionTitle} className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                {section.sectionTitle}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 h-11 rounded-xl font-bold text-xs tracking-tight transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#006ae1] to-[#00a6a0] text-white shadow-md shadow-[#006ae1]/10 scale-[1.02]"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "text-white" : "text-slate-400"}
                      />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Botón de salida seguro en el fondo */}
      <div className="space-y-4">
        <Separator className="bg-slate-100" />
        <button
          className="flex items-center gap-3 w-full h-11 px-3 text-slate-400 hover:text-rose-500 font-bold text-xs tracking-tight rounded-xl hover:bg-rose-50/50 transition-all duration-200 group"
          onClick={onLogout}
        >
          <LogOut
            size={16}
            className="text-slate-400 group-hover:text-rose-500 transition-colors"
          />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
