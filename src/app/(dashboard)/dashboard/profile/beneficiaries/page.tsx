"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/core/api/axios.instance";
import { Users, Fingerprint, Activity } from "lucide-react";
import { IPolicyBeneficiary } from "@/types/api";
import { IFamilyCharge } from "@/types/api/family-charge.interface";

export default function ProfileBeneficiariesPage() {
  // 1. Buscamos de forma limpia toda mi carga familiar histórica de la tabla puente
  const { data: familyCharge = [], isLoading: loadingFamily } = useQuery({
    queryKey: ["my-family-charge"],
    queryFn: async () => {
      const { data } = await api.get("/beneficiaries/my-charge");
      return data || [];
    },
  });

  // 2. Buscamos la póliza contratada de este año para ver el estatus de cobertura en caliente
  const { data: currentPolicy } = useQuery({
    queryKey: ["current-active-policy"],
    queryFn: async () => {
      const { data } = await api.get(
        "/policies/coverage-check?pacienteId=MI_USER_ID&period=2026-2027",
      );
      return data;
    },
  });

  if (loadingFamily) {
    return (
      <div className="p-6 text-center text-xs font-bold text-slate-500 animate-pulse">
        Consultando base de datos familiar...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6 bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="p-2 bg-indigo-600 rounded-xl">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight">Carga Familiar</h1>
          <p className="text-xs text-slate-400 font-medium">
            Consulte los miembros vinculados a su código y su estatus de
            cobertura para el lapso de salud vigente.
          </p>
        </div>
      </div>

      {familyCharge.length === 0 ? (
        <div className="bg-white border-2 border-dashed p-12 text-center rounded-2xl">
          <p className="text-xs font-bold text-slate-400">
            Su expediente familiar se encuentra vacío.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyCharge.map((charge: IFamilyCharge) => {
            // Evaluamos la info biográfica dependiendo si es otra cuenta de User o un Beneficiary externo
            const person = charge.beneficiary;

            // Verificamos si este familiar fue incluido en la póliza firmada de este año
            const policyMatch = currentPolicy?.beneficiaries.find(
              (b: IPolicyBeneficiary) => b.beneficiaryId._id === person._id,
            );
            const isCovered =
              currentPolicy?.status === "ACTIVE" &&
              policyMatch?.hasAllDocuments;

            return (
              <div
                key={charge._id}
                className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] bg-slate-100 font-black text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {charge.relationship}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 mt-1">
                      {person.firstName} {person.lastName}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <Fingerprint className="h-3 w-3" />
                      {person.nationalId
                        ? `CI: ${person.nationalId}`
                        : `R.C: ${person.civilRegistrySerial}`}
                    </p>
                  </div>

                  {/* Estatus Dinámico Cruzado */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                      isCovered
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <Activity className="h-3 w-3" />
                    {isCovered ? "Seguro Activo" : "Sin Cobertura"}
                  </span>
                </div>

                <div className="border-t border-slate-50 mt-4 pt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold">
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                      Tipo de Registro
                    </p>
                    <p className="text-slate-700 mt-0.5">
                      {charge.onModel === "User"
                        ? "Trabajador Afiliado"
                        : "Familiar Dependiente"}
                    </p>
                  </div>
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                      Auditoría de Archivos
                    </p>
                    <p
                      className={`mt-0.5 ${policyMatch?.hasAllDocuments ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {policyMatch
                        ? policyMatch.hasAllDocuments
                          ? "Verificado"
                          : "Falta Carpeta"
                        : "No Asegurado Este Año"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
