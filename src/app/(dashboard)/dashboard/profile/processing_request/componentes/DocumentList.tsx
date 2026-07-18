import { IBeneficiary } from "@/types/api";
import { Card, Chip } from "@heroui/react";
import { getDocumentsForFamilyMembers } from "../utils/get-documents-for-family-members";
import { Clock, FileText, CheckCircle2, ArrowRight, User } from "lucide-react";

const DocumentList = ({
  beneficiaries,
}: {
  beneficiaries: IBeneficiary[] | undefined;
}) => {
  const hasParents = beneficiaries?.some(
    (b) => b.relationship === "PADRE" || b.relationship === "MADRE",
  );

  const groupedDocs = getDocumentsForFamilyMembers(beneficiaries || []);

  // Construimos los documentos del titular dinámicamente
  const titularDocs = ["Copia de Cédula"];
  if (hasParents) {
    titularDocs.push("Acta de Nacimiento");
  }

  return (
    <Card className="shadow-md border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl p-4 space-y-6">
      {/* Encabezado Principal */}
      <div className="flex items-start gap-3.5 border-b border-slate-100 m-[10px]">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
          <CheckCircle2 size={22} className="stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 leading-tight">
            Consignación de Recaudos Obligatoria
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sigue estos pasos para activar de forma definitiva tu cuenta en el
            Fondo Mutual.
          </p>
        </div>
      </div>

      {/* Flujo de Pasos / Instrucciones */}
      <div className="grid gap-3 sm:grid-cols-3 text-slate-600">
        <div className="p-3.5 rounded-xl bg-slate-100/60 border border-slate-200/40 space-y-1.5 relative group hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={15} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Paso 1
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-snug">
            Dirígete a la Oficina de Suscripción.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-100/60 border border-blue-300/40 space-y-1.5 hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2 text-blue-400">
            <FileText size={15} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
              Paso 2
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-snug">
            Consigna copias físicas de tus soportes.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5 hover:bg-emerald-50 transition-colors">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 size={15} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Paso 3
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-snug">
            ¡Listo! Tu cuenta se activará en el sistema.
          </p>
        </div>
      </div>

      {/* Sección Lista de Documentos */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          Documentos Requeridos según carga familiar
        </h3>

        <div className="divide-y divide-slate-100 border border-slate-100 bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Fila Fija: Titular */}
          <div className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                <User size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  TITULAR
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:flex">
                  Documentos del propietario de la cuenta
                </p>
                <div className="max-w-xs sm:hidden flex flex-wrap gap-1.5 sm:justify-end">
                  {titularDocs.map((doc, idx) => (
                    <Chip
                      key={idx}
                      size="sm"
                      className="bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/40"
                    >
                      {doc}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-xs hidden sm:flex flex-wrap gap-1.5 sm:justify-end">
              {titularDocs.map((doc, idx) => (
                <Chip
                  key={idx}
                  size="sm"
                  className="bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/40"
                >
                  {doc}
                </Chip>
              ))}
            </div>
          </div>

          {/* Filas Dinámicas: Familiares Agrupados */}
          {groupedDocs.map((group, idx) => (
            <div
              key={idx}
              className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {group.relationship}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:flex">
                    Recaudos obligatorios por parentesco
                  </p>
                  <div className="flex flex-wrap sm:hidden gap-1.5 sm:justify-end max-w-sm">
                    {group.documents.map((doc, docIdx) => (
                      <Chip
                        key={docIdx}
                        className="bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/40"
                        size="sm"
                      >
                        {doc}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1.5 sm:justify-end max-w-sm">
                {group.documents.map((doc, docIdx) => (
                  <Chip
                    key={docIdx}
                    className="bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/40"
                    size="sm"
                  >
                    {doc}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DocumentList;
