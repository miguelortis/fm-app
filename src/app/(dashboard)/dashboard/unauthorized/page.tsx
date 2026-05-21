"use client";

import { Button, Card } from "@heroui/react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,106,225,0.08)] rounded-[2rem] p-6 sm:p-8 bg-white text-center space-y-6">
        {/* Icono de Alerta con Círculo Pulsante */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-rose-50 text-rose-500 rounded-3xl">
          <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-rose-400 opacity-20"></span>
          <ShieldAlert size={40} className="relative z-10" />
        </div>

        {/* Texto informativo */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Acceso Restringido
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Error 403 — Privilegios Insuficientes
          </p>
          <p className="text-slate-500 text-sm font-medium pt-2 leading-relaxed">
            Tu perfil de usuario no cuenta con las credenciales atómicas
            necesarias para interactuar con este módulo de software.
          </p>
        </div>

        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 text-left">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            ¿Qué puedes hacer?
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Si consideras que esto es un error, solicita al personal de
            Informática Máster la asignación del permiso correspondiente en la
            matriz.
          </p>
        </div>

        {/* Acciones de Navegación */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            //as={Link}
            //href="/dashboard"
            variant="primary"
            className="w-full bg-gradient-to-r from-[#006ae1] to-[#00a6a0] text-white rounded-2xl font-black shadow-lg shadow-[#006ae1]/20 hover:opacity-95 text-xs uppercase tracking-wider h-12 flex items-center justify-center gap-2"
          >
            <Home size={14} />
            Ir al Inicio
          </Button>
        </div>
      </Card>
    </div>
  );
}
