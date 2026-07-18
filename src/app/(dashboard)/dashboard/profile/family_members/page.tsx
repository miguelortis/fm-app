"use client";

import { ChangeEvent, useState } from "react";
import {
  Button,
  Card,
  Tabs,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Key,
  ProgressCircle,
} from "@heroui/react";
import {
  Plus,
  Trash,
  ShieldAlert,
  UserCheck,
  Inbox,
  Briefcase,
  Landmark,
  User,
  ArrowLeft,
} from "lucide-react";
import { Select } from "@/components/ui/Select/Select";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { useAuthStore } from "@/store/auth.store"; // 🌟 Importamos tu Store
import { IUser, IUserUpdateData } from "@/types/api";
import { Input } from "@/components/ui/Input/Input";
import {
  useDeleteBeneficiary,
  useGetMyDependents,
} from "@/hooks/beneficiary/useBeneficiaryMutation";
import AddNewBeneficiaryModal from "./components/AddNewBeneficieryModal";
import ApplicationRejectedModal from "./components/ApplicationRejectedModal";
import { calculateAge } from "@/components/utils/calculate-age";
import { formatWithTZ } from "@/components/utils/date";
import { getMunicipiosAsArray } from "@/components/utils/enums.ts/dependency-areas.enum";
import { bankOptions } from "@/components/utils/enums.ts/banks.enum";
import {
  useUpdateProfile,
  useUpdateStatusToProcessing,
} from "@/hooks/user/useUserMutation";
import { useRouter } from "next/navigation";

export default function FamilyMembersPage() {
  const router = useRouter();
  const { user } = useAuthStore(); // 🌟 Obtenemos al usuario para leer su status y motivo de rechazo
  const [openNewBeneficiaryModal, setOpenNewBeneficiaryModal] = useState(false);
  const [openRefusedModal, setOpenRefusedModal] = useState(
    user?.status === "refused",
  );
  const [selectedTab, setSelectedTab] = useState<string>("titular");
  const [isLoading, setIsLoading] = useState<string | null>("");
  const [userData, setUserData] = useState<IUser | null>(user);

  const { data: beneficiaries } = useGetMyDependents();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const {
    mutateAsync: deleteBeneficiary,
    variables: deleteBeneficiaryVar,
    isPending: isLoadingDeleteBeneficiary,
  } = useDeleteBeneficiary();
  const {
    mutateAsync: updateStatusProcessing,
    isPending: isLoadingStatusProcessing,
  } = useUpdateStatusToProcessing();

  const handleSubmit = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { value: Key | null; name: string } },
  ) => {
    if (!user || !e?.target?.name || !e?.target?.value) {
      return;
    }

    const fieldName = e.target.name as keyof typeof user;
    if (fieldName in user && e.target.value === user[fieldName]) return;

    const updatedData: IUserUpdateData = {
      [e.target.name]: e.target.value,
    };
    setIsLoading(e.target.name);
    await updateProfile(updatedData, { onSettled: () => setIsLoading(null) });
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement, HTMLInputElement>
      | { target: { value: Key | null; name: string } },
  ) =>
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      } as IUser;
    });

  const handleUpdateStatus = async () => {
    await updateStatusProcessing(userData?._id);
    router.push("/dashboard/profile/processing_request");
  };

  const requiredFields = [
    "placeOfBirth",
    "birthDate",
    "address",
    "phone",
  ] as Array<keyof typeof user>;
  const requiredFieldsAreFilled = requiredFields.every((field) => {
    const value = userData?.[field];
    return value !== null && value !== undefined && String(value).trim() !== "";
  });
  const isAccountValid = /^\d{20}$/.test(userData?.accountNumber || "");

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 antialiased text-slate-800">
      {/* BANNER SUPERIOR INFORMATIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Expediente de Carga Familiar y Nómina
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl">
            Completa tus datos institucionales de adscripción y registra tu
            carga familiar directa bajo auditoría de cobertura médica.
          </p>
        </div>
        <Chip
          color={user?.status === "refused" ? "danger" : "warning"}
          variant="primary"
          className="font-bold text-xs uppercase px-3 py-1 shrink-0"
        >
          Estado:{" "}
          {user?.status === "refused"
            ? "Solicitud Rechazada"
            : "Pendiente por Completar"}
        </Chip>
      </div>

      <Tabs selectedKey={selectedTab} variant="primary">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Options"
            className="*:data-[selected=true]:text-accent-foreground *:data-[selected=true]:bg-gray-400 "
          >
            <Tabs.Tab id="titular">
              1. Datos Básicos y Laborales del Titular
            </Tabs.Tab>
            <Tabs.Tab id="beneficiarios">
              2. Declaración de Carga Familiar
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel className="pt-4" id="titular">
          <div className="space-y-6 mt-5">
            {/* SECCIÓN 1.1: GENERALES */}
            <Card className="shadow-sm border border-slate-200/50 bg-white rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <User size={18} className="text-[#006ae1]" />
                <h2 className="text-sm font-black uppercase text-slate-700 tracking-wide">
                  Información Personal
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <Input
                    name="firstName"
                    required
                    label="Nombre"
                    readOnly
                    value={user?.firstName}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="lastName"
                    required
                    label="Apellido"
                    readOnly
                    value={user?.lastName}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="nationalId"
                    required
                    label="Cédula"
                    readOnly
                    value={`${user?.nationality}-${user?.nationalId}`}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="email"
                    required
                    label="Correo Electrónico"
                    readOnly
                    value={user?.email}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="placeOfBirth"
                    required
                    label="Lugar de Nacimiento"
                    placeholder="Ej: Coro, Edo. Falcón"
                    defaultValue={user?.placeOfBirth}
                    onBlur={(e) => handleSubmit(e)}
                    onChange={handleChange}
                    isLoading={isLoading === "placeOfBirth"}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="birthDate"
                    required
                    label="Fecha de Nacimiento"
                    defaultValue={
                      user?.birthDate &&
                      formatWithTZ(user?.birthDate, "yyyy-MM-dd")
                    }
                    onBlur={(e) => handleSubmit(e)}
                    onChange={handleChange}
                    type="date"
                    isLoading={isLoading === "birthDate"}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="address"
                    required
                    label="Dirección de Habitación"
                    placeholder="Ciudad, Sector, Calle y N° Casa"
                    defaultValue={user?.address}
                    onBlur={(e) => handleSubmit(e)}
                    onChange={handleChange}
                    isLoading={isLoading === "address"}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    label="Teléfono Celular"
                    name="phone"
                    required
                    placeholder="0412-XXXXXXX"
                    defaultValue={user?.phone}
                    onBlur={(e) => handleSubmit(e)}
                    onChange={handleChange}
                    type="tel"
                    onInput={(e) => {
                      const target = e.currentTarget;
                      target.value = target.value.replace(/\D/g, "");
                    }}
                    isLoading={isLoading === "phone"}
                  />
                </div>
                <div className="flex flex-col">
                  <Select
                    name="gender"
                    label="Género"
                    required
                    className="font-semibold w-full"
                    defaultValue={user?.gender}
                    placeholder="Selecciona un género"
                    isLoading={isLoading === "gender"}
                    onChange={(e) => {
                      handleSubmit({ target: { name: "gender", value: e } });
                      handleChange({ target: { name: "gender", value: e } });
                    }}
                    options={[
                      { label: "Masculino", value: "M" },
                      { label: "Femenino", value: "F" },
                    ]}
                  />
                </div>
                <div className="flex flex-col">
                  <Select
                    name="maritalStatus"
                    required
                    label="Estado Civil"
                    className="font-semibold w-full"
                    defaultValue={user?.maritalStatus}
                    isLoading={isLoading === "maritalStatus"}
                    placeholder="Selecciona estado civil"
                    onChange={(e) => {
                      handleSubmit({
                        target: { name: "maritalStatus", value: e },
                      });
                      handleChange({
                        target: { name: "maritalStatus", value: e },
                      });
                    }}
                    options={[
                      { label: "Soltero/a", value: "SOLTERO/A" },
                      { label: "Casado/a", value: "CASADO/A" },
                      { label: "Divorciado/a", value: "DIVORCIADO/A" },
                      { label: "Viudo/a", value: "VIUDO/A" },
                      { label: "Otros", value: "OTROS" },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* SECCIÓN 1.2: ADSCRIPCIÓN */}
            <Card className="shadow-sm border border-slate-200/50 bg-white rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Briefcase size={18} className="text-[#006ae1]" />
                <h2 className="text-sm font-black uppercase text-slate-700 tracking-wide">
                  Información Institucional
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <Select
                    name="personalType"
                    required
                    label="Tipo de personal"
                    className="font-semibold w-full"
                    defaultValue={user?.personalType}
                    isLoading={isLoading === "personalType"}
                    placeholder="Doc, Admin, Obr..."
                    onChange={(e) => {
                      handleSubmit({
                        target: { name: "personalType", value: e },
                      });
                      handleChange({
                        target: { name: "personalType", value: e },
                      });
                    }}
                    options={[
                      { label: "Docente", value: "DOCENTE" },
                      { label: "Administrativo", value: "ADMINISTRATIVO" },
                      { label: "Obrero", value: "OBRERO" },
                    ]}
                  />
                </div>
                <div className="flex flex-col">
                  <Select
                    name="employmentType"
                    required
                    label="Condición laboral"
                    className="font-semibold w-full"
                    defaultValue={user?.employmentType}
                    isLoading={isLoading === "employmentType"}
                    placeholder="fijo, contr.., jub..."
                    onChange={(e) => {
                      handleSubmit({
                        target: { name: "employmentType", value: e },
                      });
                      handleChange({
                        target: { name: "employmentType", value: e },
                      });
                    }}
                    options={[
                      { label: "Fijo", value: "FIJO" },
                      { label: "Contratado", value: "CONTRATADO" },
                      { label: "Jubilado", value: "JUBILADO" },
                    ]}
                  />
                </div>
                <div className="flex flex-col">
                  <Select
                    name="dependencyArea"
                    required
                    label="Área de Dependencia"
                    className="font-semibold w-full"
                    defaultValue={user?.dependencyArea}
                    isLoading={isLoading === "dependencyArea"}
                    placeholder="Selecciona área"
                    onChange={(e) => {
                      handleSubmit({
                        target: { name: "dependencyArea", value: e },
                      });
                      handleChange({
                        target: { name: "dependencyArea", value: e },
                      });
                    }}
                    options={getMunicipiosAsArray()}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    label="Profesión"
                    name="profession"
                    placeholder="Ej: Licenciado en Educación"
                    defaultValue={user?.profession}
                    isLoading={isLoading === "profession"}
                    onBlur={(e) => handleSubmit(e)}
                    onChange={handleChange}
                    type="text"
                  />
                </div>
              </div>
            </Card>

            {/* SECCIÓN 1.3: FINANZAS */}
            <Card className="shadow-sm border border-slate-200/50 bg-white rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Landmark size={18} className="text-[#006ae1]" />
                <h2 className="text-sm font-black uppercase text-slate-700 tracking-wide">
                  Información Bancaria de Nómina
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <Select
                    label="Entidad Bancaria"
                    className="font-semibold w-full"
                    options={bankOptions}
                    required
                    name="bank"
                    defaultValue={user?.bank}
                    isLoading={isLoading === "bank"}
                    onChange={(e) => {
                      handleSubmit({
                        target: { name: "bank", value: e },
                      });
                      handleChange({ target: { name: "bank", value: e } });
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    name="accountNumber"
                    label="Número de Cuenta"
                    required
                    placeholder={`Ej: ${userData?.bank || "XXXX"}XXXXXXXXXXXXXXXX`}
                    defaultValue={user?.accountNumber}
                    isLoading={isLoading === "accountNumber"}
                    maxLength={20}
                    minLength={20}
                    onChange={handleChange}
                    onBlur={handleSubmit}
                    onInput={(e) => {
                      const target = e.currentTarget;
                      target.value = target.value.replace(/\D/g, "");
                    }}
                    isInvalid={!isAccountValid}
                    errorMessage={`${userData?.accountNumber?.length} de 20`}
                    description={`${userData?.accountNumber?.length} de 20`}
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                className="font-bold bg-[#006ae1] text-white rounded-xl px-6 h-11"
                onClick={() => setSelectedTab("beneficiarios")}
                isDisabled={!requiredFieldsAreFilled || !isAccountValid}
              >
                Guardar y Continuar a Familiares
              </Button>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel className="pt-4" id="beneficiarios">
          <div className="space-y-5 mt-5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60">
              <div className="flex items-start gap-3 text-amber-800 text-xs sm:text-sm font-medium">
                <ShieldAlert
                  size={20}
                  className="shrink-0 text-amber-600 mt-0.5"
                />
                <p className="leading-tight">
                  <strong className="font-black">
                    Criterio Institucional:
                  </strong>{" "}
                  Los hijos se admiten con cobertura hasta los 25 años cumplidos
                  (excepto condiciones especiales). Toda carga ingresada
                  requiere validación de recaudos físicos.
                </p>
              </div>
              <Button
                variant="primary"
                className="font-bold bg-[#006ae1] text-white rounded-xl shrink-0 w-full lg:w-auto h-11 shadow-sm"
                onClick={() => setOpenNewBeneficiaryModal(true)}
              >
                <Plus size={18} />
                Agregar Familiar
              </Button>
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
                        PARENTESCO / NOMBRE
                      </TableColumn>
                      <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11">
                        DOCUMENTO CIVIL
                      </TableColumn>
                      <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11">
                        FECHA NAC. / EDAD
                      </TableColumn>
                      <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11">
                        CONDICIÓN
                      </TableColumn>
                      <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11 hidden lg:table-cell">
                        SOPORTE REQUERIDO
                      </TableColumn>
                      <TableColumn className="bg-slate-50/80 text-slate-700 font-bold px-4 h-11 w-16">
                        ACCIÓN
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      {beneficiaries?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                              <Inbox size={40} className="stroke-[1.5]" />
                              <p className="text-sm font-medium text-slate-500">
                                No has encolado ningún miembro familiar para
                                esta jornada.
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
                              <div className="flex flex-col gap-1.5">
                                <span className="font-bold text-slate-800 text-sm">
                                  {b?.beneficiary?.firstName}{" "}
                                  {b?.beneficiary?.lastName}
                                </span>
                                <Chip
                                  size="sm"
                                  variant="primary"
                                  color="accent"
                                  className="text-[10px] font-black uppercase h-5 max-w-fit"
                                >
                                  {b?.relationship}
                                </Chip>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3.5 font-mono font-bold text-slate-600 text-xs">
                              {b?.beneficiary?.nationalId
                                ? `${b?.beneficiary?.nationality}-${b?.beneficiary?.nationalId}`
                                : `ACTA: N°${b?.beneficiary?.birthCertificateDetails?.actNumber} / FOLIO: N°${b?.beneficiary?.birthCertificateDetails?.book}`}
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
                                  b?.beneficiary?.isSpecial
                                    ? "danger"
                                    : "default"
                                }
                                className="font-black text-[10px] uppercase"
                              >
                                {b?.beneficiary?.isSpecial
                                  ? "SÍ (DISCAPACIDAD)"
                                  : "NINGUNA"}
                              </Chip>
                            </TableCell>
                            <TableCell className="px-4 py-3.5 hidden lg:table-cell">
                              <span className="text-[11px] text-slate-500 font-medium block max-w-xs leading-tight">
                                {b?.relationship === "PADRE" &&
                                  "Copia de Cédula."}
                                {b?.relationship === "MADRE" &&
                                  "Copia de Cédula."}
                                {b?.relationship === "PAREJA" &&
                                  "Acta de Matrimonio / Concubinato y Copia de Cédula."}
                                {b?.relationship === "HIJO" &&
                                  `Acta de Nacimiento ${b?.beneficiary?.isSpecial ? "y Constancia de Discapacidad." : ""}`}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3.5">
                              <Tooltip title="Eliminar miembro de la lista">
                                {deleteBeneficiaryVar === b?.beneficiary?._id &&
                                isLoadingDeleteBeneficiary ? (
                                  <ProgressCircle
                                    isIndeterminate
                                    aria-label="Loading"
                                    size="md"
                                  >
                                    <ProgressCircle.Track>
                                      <ProgressCircle.TrackCircle />
                                      <ProgressCircle.FillCircle />
                                    </ProgressCircle.Track>
                                  </ProgressCircle>
                                ) : (
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="outline"
                                    className="text-rose-600 border-rose-100 hover:bg-rose-50 rounded-xl"
                                    onClick={() =>
                                      deleteBeneficiary(b?._id as string)
                                    }
                                  >
                                    <Trash size={15} />
                                  </Button>
                                )}
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                size="lg"
                className="font-bold text-white rounded-xl px-8 h-12 shadow-sm flex items-center gap-2"
                onClick={() => setSelectedTab("titular")}
              >
                <ArrowLeft size={18} />
                Volver
              </Button>
              <Button
                size="lg"
                className="font-bold text-white bg-emerald-600 rounded-xl px-8 h-12 shadow-sm flex items-center gap-2"
                onClick={handleUpdateStatus}
                isPending={isLoadingStatusProcessing}
              >
                <UserCheck size={18} />
                Enviar Carga Familiar a Verificación
              </Button>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>

      {/* =========================================================================
          MODALS INTERACTIVOS v3
         ========================================================================= */}

      {openRefusedModal && (
        <ApplicationRejectedModal
          open={openRefusedModal}
          onClose={(e: boolean) => setOpenRefusedModal(e)}
          refuseReason={user?.refuseReason}
        />
      )}
      {openNewBeneficiaryModal && (
        <AddNewBeneficiaryModal
          open={openNewBeneficiaryModal}
          onClose={(e) => setOpenNewBeneficiaryModal(e)}
        />
      )}
    </div>
  );
}
