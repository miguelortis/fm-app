"use client";

import { useAuditLogs } from "@/hooks/audit-logs/use-audit-logs";
import { ShieldAlert } from "lucide-react";
import { AuditDashboardKpis } from "./components/audit-dashboard-kpis";
import { AuditList } from "./components/audit-list";

export default function AuditLogsPage() {
  const { logs, kpis, loading, filters, totalPages, updateFilter, changePage } =
    useAuditLogs();

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-sm">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Bitácora de Seguridad
          </h1>
          <p className="text-xs text-slate-400 font-bold">
            Auditoría diferencial perimetral de datos corporativos
          </p>
        </div>
      </div>

      <AuditDashboardKpis kpis={kpis} />

      {/* Selectores de Filtrado */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-5 flex gap-4">
        <select
          value={filters.action}
          onChange={(e) => updateFilter({ action: e.target.value })}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-slate-400"
        >
          <option value="">Acciones (Todas)</option>
          <option value="CREATE">Registros</option>
          <option value="UPDATE">Modificaciones</option>
          <option value="DELETE">Eliminaciones</option>
        </select>

        <select
          value={filters.module}
          onChange={(e) => updateFilter({ module: e.target.value })}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-slate-400"
        >
          <option value="">Módulos (Todos)</option>
          <option value="role">Roles</option>
          <option value="users">Usuarios</option>
          <option value="appointments">Citas Médicas</option>
          <option value="institutions">Instituciones</option>
        </select>
      </div>

      {/* Lista Principal */}
      <AuditList
        logs={logs}
        loading={loading}
        totalPages={totalPages}
        filters={filters}
        changePage={changePage}
      />
    </div>
  );
}
