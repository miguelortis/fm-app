import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditLogService } from "@/core/services/audit-log.service";
import { IAuditLogFilters } from "@/types/audit-log-filters.interface";
import { ILog } from "@/types/api";

export function useAuditLogs() {
  // 1. El estado de los filtros se mantiene local porque la UI lo manipula directamente
  const [filters, setFilters] = useState<IAuditLogFilters>({
    page: 1,
    limit: 10,
    module: "",
    action: "",
  });

  // 2. Dejamos que TanStack Query se encargue de TODO el ciclo de vida asíncrono
  const { data, isLoading, isFetching, refetch } = useQuery({
    // La Query Key incluye los filtros. Si un filtro cambia, TanStack dispara la petición automáticamente
    queryKey: ["audit-logs", filters.page, filters.action, filters.module],
    queryFn: () => auditLogService.getAll(filters),
    placeholderData: (previousData) => previousData, // Evita parpadeos molestos (lag visual) al cambiar de página
    staleTime: 5000, // Los datos se consideran frescos por 5 segundos
  });

  // 3. Manejador mutador de filtros
  const updateFilter = (newFilters: Partial<IAuditLogFilters>) => {
    setFilters((prev: IAuditLogFilters) => ({
      ...prev,
      ...newFilters,
      page: 1, // Resetea a la página 1 ante nuevas búsquedas
    }));
  };

  // 4. Manejador del paginador de la UI
  const changePage = (page: number) => {
    setFilters((prev: IAuditLogFilters) => ({ ...prev, page }));
  };

  // 5. Valores derivados del data retornado de forma segura
  const logs = (data?.docs as ILog[]) || [];
  const totalPages = (data?.totalPages as number) || 1;
  const kpis = data?.kpis || {
    total: 0,
    create: 0,
    update: 0,
    delete: 0,
  };

  return {
    logs,
    kpis,
    loading: isLoading || isFetching, // Combina ambos para mostrar estados de esqueleto/carga suaves
    filters,
    totalPages,
    updateFilter,
    changePage,
    refetch,
  };
}
