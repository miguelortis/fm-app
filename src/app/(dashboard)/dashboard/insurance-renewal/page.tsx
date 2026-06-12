"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/core/api/axios.instance";
import { ClipboardCheck, UserPlus, Check, AlertTriangle } from "lucide-react";
import {
  IBeneficiary,
  IBeneficiaryCreate,
  IPolicy,
  IPolicyBeneficiary,
  IPolicyCreate,
} from "@/types/api";
import { IFamilyCharge } from "@/types/api/family-charge.interface";

export default function InsuranceRenewalPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [planId] = useState<string>("6a1e41b9b81b92cacaac9951");

  // Formulario Reactivo
  const [relationship, setRelationship] = useState<
    "PAREJA" | "MADRE" | "PADRE" | "HIJO"
  >("HIJO");
  const [hasId, setHasId] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    birthDate: "",
    state: "",
    municipality: "",
    year: "",
    book: "",
    actNumber: "",
  });

  // 📡 Traemos de forma limpia la carga familiar histórica única del usuario
  const { data: familyCharge = [], isLoading } = useQuery({
    queryKey: ["my-historical-charge-renewal"],
    queryFn: async () => {
      const { data } = await api.get("/beneficiaries/my-charge");
      return data || [];
    },
  });

  const { mutateAsync: addFamiliarToCharge, isPending: isAdding } = useMutation(
    {
      mutationFn: async (payload: IBeneficiaryCreate) =>
        api.post("/beneficiaries", payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-historical-charge-renewal"],
        });
      },
    },
  );

  const { mutateAsync: emitPolicy, isPending: isSigning } = useMutation({
    mutationFn: async (payload: IPolicyCreate) =>
      api.post("/policies/renew", payload),
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      relationship, // Le pasamos el parentesco al servicio para la tabla puente
      birthDate: new Date(formData.birthDate),
      nationalId: hasId ? formData.nationalId : null,
      birthCertificateDetails: !hasId
        ? {
            state: formData.state,
            municipality: formData.municipality,
            year: formData.year,
            book: formData.book,
            actNumber: formData.actNumber,
          }
        : null,
    };

    try {
      const { data: newBridgeRecord } = await addFamiliarToCharge(payload);
      // Al crearse e insertarse en el puente, lo marcamos automáticamente para la póliza del año
      setSelectedIds([...selectedIds, newBridgeRecord.beneficiary._id]);
      setFormData({
        firstName: "",
        lastName: "",
        nationalId: "",
        birthDate: "",
        state: "",
        municipality: "",
        year: "",
        book: "",
        actNumber: "",
      });
    } catch {
      alert("Error procesando vinculación familiar de carga única.");
    }
  };

  const handleFinalRenew = async () => {
    const payload = {
      period: "2026-2027",
      planId,
      // Mapeamos cruzando los datos para pasar el DTO contractual correcto apuntando a la colección polimórfica
      beneficiaries: familyCharge
        .filter((c: IFamilyCharge) => selectedIds.includes(c.beneficiary._id))
        .map((c: IFamilyCharge) => ({
          beneficiaryId: c.beneficiary._id,
          onModel: c.onModel,
          relationship: c.relationship,
        })),
    };

    try {
      await emitPolicy(payload);
      alert(
        "¡Su propuesta de renovación anual ha sido enviada con éxito! Estatus: PENDING_APPROVAL.",
      );
    } catch (err) {
      alert(
        "Error emitiendo contrato anual. Revise el límite estricto de edad.",
      );
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-xs font-bold text-slate-500 animate-pulse">
        Sincronizando expediente único corporativo...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* SECCIÓN 1: CHECKBOXES DESDE LA BASE HISTÓRICA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-black text-slate-800">
              Paso 1: Seleccionar asegurados para el periodo 2026-2027
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Tilde los miembros de su carga ya cargados que disfrutarán del
              seguro médico este año.
            </p>
          </div>

          {familyCharge.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50/50 p-4 rounded-xl text-center">
              Su árbol familiar no posee registros. Utilice el módulo inferior.
            </p>
          ) : (
            <div className="space-y-2">
              {familyCharge.map((charge: IFamilyCharge) => {
                const item = charge.beneficiary;
                return (
                  <div
                    key={charge._id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {item.firstName} {item.lastName}
                      </p>
                      <span className="text-[9px] bg-slate-200/60 font-black text-slate-500 px-1.5 py-0.5 rounded uppercase">
                        {charge.relationship}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(item._id)}
                      className={`p-2 rounded-xl border transition-all ${
                        selectedIds.includes(item._id)
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white text-slate-300 border-slate-200"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECCIÓN 2: CARGAR UN NUEVO INTEGRANTE A LA MATRIZ */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
            Registrar nuevo integrante en mi carga
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold border outline-none"
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold border outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={relationship}
                onChange={(e) =>
                  setRelationship(
                    e.target.value as IFamilyCharge["relationship"],
                  )
                }
                className="p-2.5 bg-slate-50 rounded-xl text-xs font-bold border text-slate-700 outline-none"
              >
                <option value="HIJO">Hijo(a)</option>{" "}
                <option value="PAREJA">Pareja</option>{" "}
                <option value="MADRE">Madre</option>{" "}
                <option value="PADRE">Padre</option>
              </select>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold border outline-none text-slate-600"
                required
              />
            </div>

            {relationship === "HIJO" && (
              <div className="bg-slate-50 p-3 rounded-xl border space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    ¿Posee Cédula de Identidad?
                  </span>
                  <input
                    type="checkbox"
                    checked={hasId}
                    onChange={(e) => setHasId(e.target.checked)}
                    className="h-4 w-4 text-slate-900"
                  />
                </div>
                {!hasId && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1 animate-in fade-in duration-200">
                    <input
                      type="text"
                      placeholder="Estado"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="p-2 bg-white border rounded-lg text-[11px]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Municipio"
                      value={formData.municipality}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          municipality: e.target.value,
                        })
                      }
                      className="p-2 bg-white border rounded-lg text-[11px]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Año"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="p-2 bg-white border rounded-lg text-[11px]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Libro"
                      value={formData.book}
                      onChange={(e) =>
                        setFormData({ ...formData, book: e.target.value })
                      }
                      className="p-2 bg-white border rounded-lg text-[11px]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="N° Acta"
                      value={formData.actNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, actNumber: e.target.value })
                      }
                      className="p-2 bg-white border rounded-lg text-[11px]"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {hasId && (
              <input
                type="text"
                placeholder="Número de Cédula"
                value={formData.nationalId}
                onChange={(e) =>
                  setFormData({ ...formData, nationalId: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-semibold border outline-none"
                required
              />
            )}

            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />{" "}
              {isAdding ? "Buscando coincidencias..." : "Añadir a mi Carga"}
            </button>
          </form>
        </div>
      </div>

      {/* RESUMEN DE LA PÓLIZA ANUAL */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-fit sticky top-6">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <ClipboardCheck className="h-4 w-4" /> Póliza a Contratar
          </h2>
          {selectedIds.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">
              Marque los familiares arriba para armar la cotización.
            </p>
          ) : (
            <div className="space-y-2">
              {familyCharge
                .filter((c: IFamilyCharge) =>
                  selectedIds.includes(c.beneficiary._id),
                )
                .map((c: IFamilyCharge) => (
                  <div
                    key={c._id}
                    className="p-2.5 bg-slate-50 rounded-xl border text-[11px] font-bold text-slate-700 flex justify-between"
                  >
                    <span>
                      {c.beneficiary.firstName} {c.beneficiary.lastName}
                    </span>
                    <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[9px] uppercase">
                      {c.relationship}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
        <button
          onClick={handleFinalRenew}
          disabled={selectedIds.length === 0 || isSigning}
          className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase disabled:opacity-30 tracking-wider shadow-sm"
        >
          {isSigning ? "Firmando..." : "Emitir Propuesta de Póliza"}
        </button>
      </div>
    </div>
  );
}
