import { IAuditLogFilters } from "@/types/audit-log-filters.interface";

interface FiltersProps {
  filters: IAuditLogFilters;
  onFilterChange: (filters: Partial<IAuditLogFilters>) => void;
}

export function AuditFilters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        {/* Filtro por Acción */}
        <select
          value={filters.action}
          onChange={(e) => onFilterChange({ action: e.target.value })}
          className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 font-medium"
        >
          <option value="">Todas las acciones</option>
          <option value="CREATE">Registros (Creaciones)</option>
          <option value="UPDATE">Modificaciones (Modificaciones)</option>
          <option value="DELETE">Eliminaciones (Eliminaciones)</option>
        </select>

        {/* Filtro por Módulo */}
        <select
          value={filters.module}
          onChange={(e) => onFilterChange({ module: e.target.value })}
          className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 font-medium"
        >
          <option value="">Todos los módulos</option>
          <option value="roles">Roles de Sistema</option>
          <option value="users">Usuarios / Personal</option>
          <option value="appointments">Citas Médicas</option>
          <option value="medical-records">Historias Clínicas</option>
        </select>
      </div>

      <div className="text-xs text-slate-400 font-medium">
        Mostrando registros en tiempo real • UNEFM Salud
      </div>
    </div>
  );
}
