import { IAuditLogFilters } from "@/types/audit-log-filters.interface";
import api from "../api/axios.instance";

export const auditLogService = {
  getAll: async (filters: IAuditLogFilters) => {
    const params = new URLSearchParams();
    if (filters.module) params.append("module", filters.module);
    if (filters.action) params.append("action", filters.action);
    params.append("page", String(filters.page || 1));
    params.append("limit", String(filters.limit || 15));

    const { data } = await api.get(`/audit-logs?${params.toString()}`);
    return data;
  },
};
