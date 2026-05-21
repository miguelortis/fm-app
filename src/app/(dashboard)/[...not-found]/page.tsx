"use client";

import { Button, Card } from "@heroui/react";
import { Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,106,225,0.08)] rounded-[2rem] p-6 sm:p-8 bg-white text-center space-y-6">
        {/* Número 404 Estilizado con Degradado */}
        <div className="space-y-1">
          <span className="text-6xl font-black bg-gradient-to-r from-[#006ae1] to-[#00a6a0] bg-clip-text text-transparent tracking-tighter block select-none">
            404
          </span>
          <div className="p-2 w-fit mx-auto bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
            <Search size={20} />
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Módulo No Encontrado
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            La dirección web no existe
          </p>
          <p className="text-slate-500 text-sm font-medium pt-2 leading-relaxed">
            La pantalla a la que intentas acceder ha sido movida, renombrada o
            no forma parte de la arquitectura del sistema UNEFM Salud.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-wider h-12 flex items-center justify-center gap-2"
            onPress={() => router.back()}
          >
            <ArrowLeft size={14} />
            Regresar
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="primary"
            className="w-full bg-gradient-to-r from-[#006ae1] to-[#00a6a0] text-white rounded-2xl font-black shadow-lg shadow-[#006ae1]/20 hover:opacity-95 text-xs uppercase tracking-wider h-12 flex items-center justify-center gap-2"
          >
            Panel Principal
          </Button>
        </div>
      </Card>
    </div>
  );
}
