"use client";

import { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Users,
  FileText,
  Search,
  ArrowRight,
  X,
  Calendar,
  Fingerprint,
} from "lucide-react";
import { IPolicy, IPolicyBeneficiary } from "@/types/api";
import DocumentChecklist from "./components/DocumentCheckList";
import { usePendingReviewsMutation } from "@/hooks/policy/usePolicyMutation";

export default function AdminPolicyReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  // 📡 1. Buscamos todas las renovaciones anuales pendientes.
  // 🌟 EXTRAEMOS "refetch" de la desestructuración de TanStack Query
  const { data: pendingPolicies = [], refetch } = usePendingReviewsMutation();

  // Estado derivado en caliente para el panel de detalles
  const selectedPolicy =
    pendingPolicies.find((p) => p._id === selectedPolicyId) || null;

  // Filtro de búsqueda en tiempo real
  const filteredPolicies = pendingPolicies.filter((policy: IPolicy) => {
    const fullName =
      `${policy?.titular?.firstName} ${policy?.titular?.lastName}`.toLowerCase();
    const idCard = policy?.titular?.nationalId?.toLowerCase() || "";
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      idCard.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen flex flex-col lg:flex-row gap-6">
      {/* SECCIÓN IZQUIERDA: LISTA MAESTRA DE TRABAJADORES RESUMIDA */}
      <div className="flex-1 space-y-4">
        <div className="bg-slate-950 text-white p-5 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight">
              Control de Renovaciones de Pólizas
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Bandeja de auditoría masiva para la aprobación de cargas
              familiares.
            </p>
          </div>
        </div>

        {/* Input Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar titular por nombre, apellido o número de cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 p-3 pl-10 rounded-xl text-xs font-semibold outline-none shadow-sm focus:border-slate-400 transition-colors"
          />
        </div>

        {/* Tarjetas de la Lista de Espera */}
        {filteredPolicies.length === 0 ? (
          <div className="bg-white border p-12 text-center rounded-2xl text-xs font-bold text-slate-400">
            No hay carpetas físicas pendientes de auditoría con ese criterio.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPolicies.map((policy: IPolicy) => {
              const totalBeneficiaries = policy.beneficiaries?.length || 0;
              const completedCount =
                policy.beneficiaries?.filter(
                  (b: IPolicyBeneficiary) => b.hasAllDocuments,
                ).length || 0;

              return (
                <div
                  key={policy._id}
                  onClick={() => setSelectedPolicyId(policy._id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedPolicyId === policy._id
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-800 border-slate-100 hover:border-slate-200 shadow-sm"
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-tight">
                      {policy?.titular?.firstName} {policy?.titular?.lastName}
                    </h3>
                    <p
                      className={`text-[10px] font-mono mt-0.5 ${selectedPolicyId === policy._id ? "text-slate-300" : "text-slate-400"}`}
                    >
                      C.I: {policy?.titular?.nationalId} | Plan:{" "}
                      <span className="font-bold uppercase font-sans">
                        {policy.planId?.name}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                        selectedPolicyId === policy._id
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-50 text-slate-500 border"
                      }`}
                    >
                      <Users className="h-3 w-3" />
                      {completedCount}/{totalBeneficiaries} Listos
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: PANEL DETALLE EXPANDIBLE */}
      <div className="w-full lg:w-[420px] shrink-0">
        {!selectedPolicy ? (
          <div className="h-48 lg:h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400 sticky top-6 bg-white/50">
            <FileText className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs font-black uppercase tracking-wide">
              Seleccione una solicitud
            </p>
            <p className="text-[11px] font-medium opacity-80 max-w-[200px] mt-0.5">
              Haga clic sobre un trabajador para auditar su carpeta física.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xl space-y-4 sticky top-6 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Header Detalle */}
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase font-mono">
                  Periodo: {selectedPolicy.period}
                </span>
                <h2 className="text-sm font-black text-slate-900 mt-1">
                  {selectedPolicy?.titular?.firstName}{" "}
                  {selectedPolicy?.titular?.lastName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPolicyId(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Datos Corporativos */}
            <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-[11px] font-medium text-slate-600 border border-slate-100 font-mono">
              <p className="flex items-center gap-1.5">
                <Fingerprint className="h-3.5 w-3.5 text-slate-400" /> CI:{" "}
                <span className="font-bold text-slate-800 font-sans">
                  {selectedPolicy?.titular?.nationalId}
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Correo:{" "}
                <span className="font-bold text-slate-800 font-sans lowercase">
                  {selectedPolicy?.titular?.email}
                </span>
              </p>
            </div>

            {/* Familiares Desglosados */}
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Desglose de Familiares Asegurados
              </p>

              {selectedPolicy.beneficiaries.map((b: IPolicyBeneficiary) => (
                <div
                  key={b.beneficiaryId._id}
                  className="p-3 bg-white border border-slate-200/60 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[8px] bg-slate-900 text-white font-black px-1.5 py-0.5 rounded uppercase font-sans">
                        {b.relationship}
                      </span>
                      <span className="text-slate-800 font-black ml-2">
                        {b.beneficiaryId.firstName} {b.beneficiaryId.lastName}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold ${b.hasAllDocuments ? "text-emerald-600" : "text-amber-500"}`}
                    >
                      {b.hasAllDocuments ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                      )}
                    </span>
                  </div>

                  {/* 🌟 PASAMOS EL REFETCH DEL PADRE AL HIJO MODULAR */}
                  <DocumentChecklist
                    titularId={selectedPolicy?.titular?._id}
                    beneficiaryItem={b}
                    refetchPendingPolicies={refetch}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
