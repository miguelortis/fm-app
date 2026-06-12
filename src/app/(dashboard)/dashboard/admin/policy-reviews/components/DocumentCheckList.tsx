"use client";

import { useState } from "react";
import { useFamilyChargeMutation } from "@/hooks/beneficiary/useFamilyChargeMutation";
import { IPolicy, IPolicyBeneficiary } from "@/types/api";
import { IFamilyCharge } from "@/types/api/family-charge.interface";
import { Loader2 } from "lucide-react";
import { QueryObserverResult } from "@tanstack/react-query";

interface DocumentChecklistProps {
  titularId: string;
  beneficiaryItem: IPolicyBeneficiary & { familyChargeDetails?: IFamilyCharge };
  refetchPendingPolicies: () => Promise<QueryObserverResult<IPolicy[], Error>>; // 🌟 NUEVA PROP: Para esperar la actualización de red
}

export default function DocumentChecklist({
  titularId,
  beneficiaryItem,
  refetchPendingPolicies,
}: DocumentChecklistProps) {
  const { mutateAsync: toggleDocumentCheck } = useFamilyChargeMutation();

  // Estado local para controlar el spinner por cada casilla individual
  const [processingKey, setProcessingKey] = useState<string | null>(null);

  // Extraemos los recaudos físicos del expediente permanente
  const docs = beneficiaryItem?.familyChargeDetails?.physicalDocuments || {};

  // Matriz de requerimientos legales según el parentesco
  const requirementsMap: Record<string, { key: string; label: string }[]> = {
    PADRE: [
      {
        key: "parentBirthCertificate",
        label: "Partida de Nacimiento del Titular",
      },
      { key: "parentCedula", label: "Copia de Cédula del Padre" },
    ],
    MADRE: [
      {
        key: "parentBirthCertificate",
        label: "Partida de Nacimiento del Titular",
      },
      { key: "parentCedula", label: "Copia de Cédula de la Madre" },
    ],
    HIJO: [
      {
        key: "childBirthCertificate",
        label: "Partida de Nacimiento del Hijo(a)",
      },
      { key: "titularCedula", label: "Copia de Cédula del Titular" },
      ...(beneficiaryItem?.beneficiaryId?.isSpecial
        ? [
            {
              key: "specialProof",
              label: "Comprobante Caso Especial (Obligatorio)",
            },
          ]
        : []),
    ],
    PAREJA: [
      {
        key: "marriageCertificate",
        label: "Acta de Matrimonio / Patrimonio Legal",
      },
      { key: "partnerCedula", label: "Copia de Cédula de la Pareja" },
      { key: "titularCedula", label: "Copia de Cédula del Titular" },
    ],
  };

  const currentRequirements =
    requirementsMap[beneficiaryItem.relationship] || [];

  // ⚡ CONTROLADOR ASÍNCRONO DOBLE: Espera la mutación Y la recarga de la lista
  const handleCheckboxChange = async (key: string, isChecked: boolean) => {
    setProcessingKey(key); // 1. Encendemos el spinner local
    try {
      // 2. Esperamos que el backend guarde el documento en Atlas
      await toggleDocumentCheck({
        titularId,
        beneficiaryId: beneficiaryItem?.beneficiaryId?._id,
        documentKey: key,
        isProvided: isChecked,
      });

      // 3. 🔥 AQUÍ ESTÁ LA MAGIA: Esperamos activamente que TanStack Query
      // termine de descargar el nuevo estado de /pending-reviews desde el servidor
      await refetchPendingPolicies();
    } catch (error) {
      console.error("Error al actualizar recaudo:", error);
    } finally {
      setProcessingKey(null); // 4. Apagamos el spinner únicamente cuando TODA la data está sincronizada
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
      {currentRequirements.map((req) => {
        const docKey = req.key as keyof NonNullable<
          IFamilyCharge["physicalDocuments"]
        >;
        const isChecked = docs[docKey]?.isProvided || false;

        const isLoading = processingKey === req.key;

        return (
          <label
            key={req.key}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
              isLoading
                ? "bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed"
                : isChecked
                  ? "bg-emerald-50/60 border-emerald-200 text-slate-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 flex items-center justify-center shrink-0">
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 text-slate-900 animate-spin" />
                ) : (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={processingKey !== null}
                    onChange={(e) =>
                      handleCheckboxChange(req.key, e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-0 cursor-pointer accent-slate-900 disabled:cursor-not-allowed"
                  />
                )}
              </div>

              <span
                className={`text-[11px] font-bold ${isChecked && !isLoading ? "line-through text-slate-400 font-medium" : ""}`}
              >
                {req.label}
              </span>
            </div>

            {isLoading ? (
              <span className="text-[9px] text-slate-400 font-mono font-bold px-1.5 py-0.5 animate-pulse">
                Sincronizando...
              </span>
            ) : isChecked ? (
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded">
                Recibido
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}
