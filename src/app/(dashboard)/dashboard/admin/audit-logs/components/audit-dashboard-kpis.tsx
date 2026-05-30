import { Activity, PlusCircle, RefreshCw, Trash2 } from "lucide-react";

interface KpisProps {
  kpis: { total: number; create: number; update: number; delete: number };
}

export function AuditDashboardKpis({ kpis }: KpisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Mutaciones Totales
          </p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {kpis.total}
          </h3>
        </div>
        <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
          <Activity className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Registros Creados
          </p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">
            {kpis.create}
          </h3>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-green-600">
          <PlusCircle className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Actualizaciones</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">
            {kpis.update}
          </h3>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
          <RefreshCw className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Borrados / Cancelados
          </p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">
            {kpis.delete}
          </h3>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-red-600">
          <Trash2 className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
