import { useMemo } from "react";
import { getObjectDiff } from "../utils/diff-detector";

export function AuditInspector({
  prev,
  next,
  action,
}: {
  prev: Record<string, unknown> | null;
  next: Record<string, unknown> | null;
  action: string;
}) {
  const diffs = useMemo(() => {
    return getObjectDiff(prev, next);
  }, [prev, next]);

  if (action === "DELETE") {
    return (
      <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-4 text-xs text-rose-900">
        <p className="font-bold text-rose-700">
          ⚠️ Respaldo estructural pre-eliminación:
        </p>
        <pre className="mt-2 p-3 bg-white border border-rose-200 rounded-lg overflow-x-auto text-slate-700 font-mono leading-relaxed">
          {JSON.stringify(prev, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
        <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-2">Campo</th>
            {action === "UPDATE" && <th className="px-4 py-2">Antes</th>}
            <th className="px-4 py-2">
              {action === "CREATE" ? "Valor" : "Después"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
          {diffs.map((diff, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-4 py-2.5 font-bold text-slate-800 bg-slate-50/30">
                {diff.path}
              </td>
              {action === "UPDATE" && (
                <td className="px-4 py-2.5 bg-rose-50/40 text-rose-600 line-through">
                  {typeof diff.before === "object"
                    ? JSON.stringify(diff.before)
                    : String(diff.before ?? "null")}
                </td>
              )}
              <td
                className={`px-4 py-2.5 ${action === "UPDATE" ? "bg-emerald-50/40 text-emerald-700 font-bold" : "text-slate-800"}`}
              >
                {typeof diff.after === "object"
                  ? JSON.stringify(diff.after)
                  : String(diff.after ?? "null")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
