import { ILog } from "@/types/api/log.interface";
import { IAuditLogFilters } from "@/types/audit-log-filters.interface";

export interface IListProps {
  logs: ILog[];
  loading: boolean;
  totalPages: number;
  filters: IAuditLogFilters;
  changePage: (page: number) => void;
}
