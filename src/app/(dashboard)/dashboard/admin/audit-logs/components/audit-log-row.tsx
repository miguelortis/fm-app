import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AuditInspector } from "./audit-inspector";
import { ILog } from "@/types/api/log.interface";
import { getActionTranslation } from "../utils/get-action-translation";

export function AuditLogRow({ log }: { log: ILog }) {
  const [open, setOpen] = useState(false);

  const styles: Record<string, string> = {
    CREATE: "bg-emerald-50 text-emerald-700 border-emerald-100",
    UPDATE: "bg-indigo-50 text-indigo-700 border-indigo-100",
    DELETE: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="border-b border-slate-100 transition-colors hover:bg-slate-50/30">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer text-xs font-medium text-slate-600"
      >
        <div className="w-1/4">
          <p className="font-bold text-slate-900 text-sm">{log.userName}</p>
          <span className="text-[10px] text-slate-400 font-mono">
            {log.ipAddress}
          </span>
        </div>
        <div className="w-24">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black border tracking-wider ${styles[log.action] || styles.UPDATE}`}
          >
            {getActionTranslation(log.action)}
          </span>
        </div>
        <div className="w-36">
          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px]">
            {log.module}
          </span>
        </div>
        <div className="flex-1 text-slate-500 font-medium">
          Afectó propiedades en la colección{" "}
          <span className="font-bold text-slate-700 font-mono">
            {log.module}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-bold text-right">
          <span>{new Date(log.createdAt).toLocaleString()}</span>
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>
      {open && (
        <div className="p-4 bg-slate-50/40 border-t border-slate-100">
          <AuditInspector
            prev={log.previousState}
            next={log.newState}
            action={log.action}
          />
        </div>
      )}
    </div>
  );
}
