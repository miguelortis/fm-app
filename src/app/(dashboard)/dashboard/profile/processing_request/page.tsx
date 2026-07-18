"use client";

import {
  Card,
  Chip,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import {
  FileText,
  Loader2,
  Landmark,
  Briefcase,
  User,
  HelpCircle,
  Inbox,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useGetMyDependents } from "@/hooks/beneficiary/useBeneficiaryMutation";
import { formatWithTZ } from "@/components/utils/date";
import DocumentList from "./componentes/DocumentList";
import { DEPENDENCY_AREAS } from "@/components/utils/enums.ts/dependency-areas.enum";
import { Banks } from "@/components/utils/enums.ts/banks.enum";

export default function ProcessingRequestPage() {
  const { user, logout } = useAuthStore();
  const { data: beneficiaries } = useGetMyDependents();

  // Simulador de la carga familiar guardada en el expediente (Bypass de lectura)
  // En producción, esto vendrá del objeto 'user.beneficiaries' o de una query de TanStack

  const calculateAge = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 antialiased text-slate-800">
      {/* CARD PRINCIPAL DE ESTATUS */}
      <Card className="shadow-sm border border-blue-100 rounded-3xl overflow-hidden bg-white">
        <Card.Content className="p-6 md:p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#006ae1] shadow-inner relative">
            <Loader2 size={32} className="animate-spin" />
            <FileText size={18} className="absolute" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Expediente en Auditoría de Cobertura
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Tu declaración de datos y carga familiar ha sido congelada y
              encolada con éxito. Actualmente se encuentra en fase de revisión
              física.
            </p>
          </div>

          <Chip
            color="accent"
            variant="primary"
            className="font-black text-[10px] uppercase tracking-wider px-4 py-1.5 animate-pulse"
          >
            Estatus: En Proceso de Verificación
          </Chip>
        </Card.Content>
      </Card>

      {/* REQUISITOS DE AUDITORÍA FÍSICA */}
      <DocumentList beneficiaries={beneficiaries} />

      {/* DETALLES DE LOS DATOS CONSIGNADOS POR EL TITULAR */}
      {/* TARJETA: DATOS PERSONALES */}
      <Card className="shadow-sm border border-slate-200/60 bg-white rounded-2xl p-5 space-y-3">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
          <User size={14} className="text-[#006ae1]" />
          Datos Personales
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-3 gap-x-2 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Cédula de Identidad
            </span>
            <span>{`${user?.nationality}-${user?.nationalId}`}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Nombres
            </span>
            <span>{user?.firstName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Apellidos
            </span>
            <span className="truncate">{user?.lastName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Correo
            </span>
            <span className="truncate">{user?.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Telefono
            </span>
            <span className="truncate">{user?.phone}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Fecha de Nacimiento
            </span>
            <span className="truncate">
              {user?.birthDate && formatWithTZ(user?.birthDate, "dd/MM/yyy")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Lugar de Nacimiento
            </span>
            <span className="truncate">{user?.placeOfBirth}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Genero
            </span>
            <span className="truncate">
              {{ F: "Femenino", M: "Masculino" }[user?.gender || "M"]}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Estado Civil
            </span>
            <span className="truncate">{user?.maritalStatus}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase">
              Dirección de Habitación
            </span>
            <span className="truncate">{user?.address}</span>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* TARJETA: DATOS LABORALES */}
        <Card className="shadow-sm border border-slate-200/60 bg-white rounded-2xl p-5 space-y-3">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
            <Briefcase size={14} className="text-[#006ae1]" />
            Adscripción Institucional
          </h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Tipo Personal
              </span>
              <span>{user?.personalType || "ADMINISTRATIVO"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Condición laboral
              </span>
              <span>{user?.employmentType || "FIJO"}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Área / Dependencia
              </span>
              <span className="truncate">
                {
                  DEPENDENCY_AREAS[
                    user?.dependencyArea as keyof typeof DEPENDENCY_AREAS
                  ]
                }
              </span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Profesión
              </span>
              <span className="truncate">{user?.profession}</span>
            </div>
          </div>
        </Card>

        {/* TARJETA: DATOS FINANCIEROS */}
        <Card className="shadow-sm border border-slate-200/60 bg-white rounded-2xl p-5 space-y-3">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
            <Landmark size={14} className="text-[#006ae1]" />
            Información de Nómina
          </h2>
          <div className="grid grid-cols-1 gap-y-3 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Entidad Bancaria
              </span>
              <span>
                {Banks[user?.bank as keyof typeof Banks].toUpperCase() ||
                  "BANCO DE VENEZUELA"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Número de Cuenta
              </span>
              <span className="font-mono tracking-wide text-xs sm:text-sm text-slate-600">
                {user?.accountNumber || "01020344556677889900"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* RESUMEN DE LA CARGA FAMILIAR EN ESPERA */}
      <Card className="shadow-sm border border-slate-200/60 bg-white rounded-2xl overflow-hidden">
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <User size={14} className="text-[#006ae1]" />
            Carga Familiar Declarada ({beneficiaries?.length})
          </h3>
          <Chip
            size="sm"
            color="default"
            variant="primary"
            className="text-[10px] font-bold uppercase"
          >
            Solo Lectura
          </Chip>
        </div>

        <div className="border border-slate-200/60 rounded-2xl bg-white overflow-hidden shadow-sm">
          <Table aria-label="Tabla transaccional de carga familiar">
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Team members"
                className="min-w-[600px]"
              >
                <TableHeader>
                  <TableColumn
                    isRowHeader
                    className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11"
                  >
                    NOMBRE Y APELLIDO
                  </TableColumn>
                  <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11">
                    DOCUMENTO DE IDENTIDAD
                  </TableColumn>
                  <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11 w-16">
                    PARENTESCO
                  </TableColumn>
                  <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11">
                    FECHA NAC. / EDAD
                  </TableColumn>
                  <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11">
                    CONDICIÓN
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {beneficiaries?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <Inbox size={40} className="stroke-[1.5]" />
                          <p className="text-sm font-medium text-slate-500">
                            No has encolado ningún miembro familiar para esta
                            jornada.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    beneficiaries?.map((b, idx) => (
                      <TableRow
                        key={idx}
                        className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="px-4 py-3.5">
                          <span className="font-bold text-slate-600 block max-w-xs leading-tight">
                            {`${b?.beneficiary?.firstName} ${b?.beneficiary?.lastName}`}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3.5 font-mono font-bold text-slate-600 text-xs">
                          {b?.beneficiary?.nationalId
                            ? `${b?.beneficiary?.nationality}-${b?.beneficiary?.nationalId}`
                            : `ACTA: N°${b?.beneficiary?.birthCertificateDetails?.actNumber} / FOLIO: N°${b?.beneficiary?.birthCertificateDetails?.book}`}
                        </TableCell>
                        <TableCell className="px-4 py-3.5 hidden lg:table-cell">
                          <span className="text-[11px] font-bold text-slate-600 block max-w-xs leading-tight">
                            {b?.relationship}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <div className="flex flex-col text-xs font-semibold text-slate-700">
                            <span>
                              {formatWithTZ(
                                b?.beneficiary?.birthDate,
                                "dd-MM-yyyy",
                              )}
                            </span>
                            <span className="text-slate-400 text-[11px] font-normal">
                              {calculateAge(b?.beneficiary?.birthDate)} años
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <Chip
                            size="sm"
                            variant="primary"
                            color={
                              b?.beneficiary?.isSpecial ? "danger" : "default"
                            }
                            className="font-black text-[10px] uppercase"
                          >
                            {b?.beneficiary?.isSpecial
                              ? "SÍ (DISCAPACIDAD)"
                              : "NINGUNA"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </Card>

      {/* ACCIONES DEL ENTORNO */}
      <div className="flex flex-row gap-3 justify-center pt-2">
        <Button variant="tertiary">
          <HelpCircle size={16} />
          Soporte Técnico
        </Button>
        <Button variant="danger-soft" onClick={logout}>
          <LogOut size={16} />
          Salir del Sistema
        </Button>
      </div>
    </div>
  );
}
