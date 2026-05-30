import { AuditLogRow } from "./audit-log-row";
import { IListProps } from "../types/list-props.interface";

export function AuditList({
  logs,
  loading,
  totalPages,
  filters,
  changePage,
}: IListProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium text-xs">
          Cargando registros...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-medium text-xs">
          Sin registros que coincidan con la búsqueda.
        </div>
      ) : (
        <div>
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <AuditLogRow key={log._id} log={log} />
            ))}
          </div>

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => changePage((filters.page || 1) - 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs font-bold text-slate-500">
                Página {filters.page} de {totalPages}
              </span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => changePage((filters.page || 1) + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
