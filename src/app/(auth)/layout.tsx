"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@heroui/react";
import NextLink from "next/link";
import { FrozenRoute } from "@/components/utils/frozen-route";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mode = pathname.replace("/", ""); // "login" o "register"

  return (
    <div className="min-h-screen bg-white flex w-full">
      {/* PANEL IZQUIERDO: Branding (Estático) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          {/* Espacio para el logo-unefm.png */}
          <div className="w-32 h-16 bg-white/20 backdrop-blur-md rounded-lg mx-auto mb-8 flex items-center justify-center text-white font-bold">
            LOGO
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Tu salud en buenas manos
          </h2>
          <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
            Accede a tu historial médico, agenda citas y consulta resultados.
          </p>
        </div>
      </div>

      {/* PANEL DERECHO: Contenido Dinámico */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 ">
        <div className="w-full max-w-md h-full">
          <Link
            //as={NextLink}
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-unefm-blue transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>

          {/* TAB SWITCHER: Ahora usa Links reales */}
          <div className="relative flex bg-slate-100 rounded-2xl p-1.5 mb-10 border border-slate-200">
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-xl gradient-hero shadow-lg"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              style={{
                width: mode !== "forgot-password" ? "calc(50% - 6px)" : "",
                left: mode === "login" ? "6px" : "calc(50%)",
              }}
            />
            <NextLink
              href="/login"
              className={`relative z-10 flex-1 py-3 text-center text-sm font-bold rounded-xl transition-colors ${mode === "login" ? "text-white" : "text-slate-500"}`}
            >
              Iniciar Sesión
            </NextLink>
            <NextLink
              href="/register"
              className={`relative z-10 flex-1 py-3 text-center text-sm font-bold rounded-xl transition-colors ${mode === "register" ? "text-white" : "text-slate-500"}`}
            >
              Registrarse
            </NextLink>
          </div>

          {/* Animación del formulario al cambiar de página */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <FrozenRoute>{children}</FrozenRoute>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
