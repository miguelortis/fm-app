"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/core/api/axios.instance";
import { Sliders, HelpCircle, ArrowRight } from "lucide-react";

export default function AdminPeriodClosurePage() {
  const [actionType, setActionType] = useState<"EXCLUDE" | "MIGRATE">(
    "EXCLUDE",
  );

  // Datos estáticos/dinámicos de ejemplo para los selectores de equivalencias
  const oldPlans = [
    { _id: "P_A", name: "PLAN A" },
    { _id: "P_B", name: "PLAN B" },
  ];
  const [mappings, setMappings] = useState<Record<string, string>>({});

  const { mutateAsync: executeClosure, isPending } = useMutation({
    mutationFn: async (payload: {
      action: "EXCLUDE" | "MIGRATE";
      mappings: Record<string, string> | null;
    }) => {
      return api.post("/policies/global-closure-lapso", payload);
    },
  });

  const handleProcess = async () => {
    await executeClosure({
      action: actionType,
      mappings: actionType === "MIGRATE" ? mappings : null,
    });
    alert("¡Proceso de cierre ejecutado con éxito a nivel nacional!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Sliders className="h-5 w-5 text-slate-800" />
        <h1 className="text-base font-black text-slate-900">
          Panel de Control: Cierre de Cuentas Anuales
        </h1>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-2">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-slate-400" /> ¿Qué desea hacer
            con los titulares rezagados que no actualizaron en la jornada?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setActionType("EXCLUDE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${actionType === "EXCLUDE" ? "bg-rose-950 border-rose-950 text-white" : "bg-white text-slate-600"}`}
            >
              Dejar Sin Cobertura (Excluir)
            </button>
            <button
              onClick={() => setActionType("MIGRATE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${actionType === "MIGRATE" ? "bg-indigo-950 border-indigo-950 text-white" : "bg-white text-slate-600"}`}
            >
              Asignar Plan Automático
            </button>
          </div>
        </div>

        {actionType === "MIGRATE" && (
          <div className="border p-4 rounded-2xl space-y-3 bg-slate-50/40 animate-in fade-in duration-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Matriz de Reemplazo Contractual
            </p>
            {oldPlans.map((op) => (
              <div
                key={op._id}
                className="flex items-center justify-between bg-white p-3 rounded-xl border text-xs font-bold text-slate-700 shadow-sm"
              >
                <span>{op.name}</span>{" "}
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <select
                  onChange={(e) =>
                    setMappings({ ...mappings, [op._id]: e.target.value })
                  }
                  className="bg-slate-50 border p-2 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 w-48"
                >
                  <option value="">Sustituir por...</option>
                  <option value="NEW_APS">APS</option>
                  <option value="NEW_APS_PLUS">APS PLUS</option>
                </select>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleProcess}
          disabled={isPending}
          className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider shadow-sm"
        >
          {isPending
            ? "Procesando Cierre de Lotes..."
            : "Ejecutar Cierre General e Iniciar Nuevo Periodo"}
        </button>
      </div>
    </div>
  );
}
