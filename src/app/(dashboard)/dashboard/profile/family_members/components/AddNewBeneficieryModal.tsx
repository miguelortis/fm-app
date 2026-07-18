import { CForm } from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Input/Input";
import Modal from "@/components/ui/Modal/Modal";
import { Select } from "@/components/ui/Select/Select";
import { calculateAge } from "@/components/utils/calculate-age";
import {
  getMunicipiosOptions,
  MUNICIPALITIES,
} from "@/components/utils/enums.ts/municipalities.enum";
import { STATE_OPTIONS } from "@/components/utils/enums.ts/states.enum";
import { generateCivilRegistrySerial } from "@/components/utils/generate-civil-registry-serial";
import { useAddBeneficiaryMutation } from "@/hooks/beneficiary/useBeneficiaryMutation";
import { IBeneficiary, IUserRegisterData } from "@/types/api";
import { Button, Checkbox, Key, toast } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

const defaultValues = {
  nationality: "V",
  state: "",
  municipality: "",
  year: "",
  book: "",
  actNumber: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  placeOfBirth: "",
  nationalId: "",
};

interface IAddNewBeneficiaryModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

const AddNewBeneficiaryModal = ({
  open,
  onClose,
}: IAddNewBeneficiaryModalProps) => {
  const formMethods = useForm({
    defaultValues: defaultValues,
  });

  const [state, setState] = useState<keyof typeof MUNICIPALITIES>();
  const [relationship, setRelationship] = useState<Key | null>(null);
  const [isSpecial, setIsSpecial] = useState<boolean>(false);
  const [hasNoId, setHasNoId] = useState<boolean>(false);

  const { mutateAsync: addBeneficiary, isPending: isLoadingAddBeneficiary } =
    useAddBeneficiaryMutation();

  useEffect(() => {
    return () => {
      setHasNoId(false);
      setIsSpecial(false);
      setRelationship("");
      formMethods.reset(defaultValues);
    };
  }, [setHasNoId, setIsSpecial, setRelationship, formMethods]);

  const generateNationalId = () => {
    const { state, municipality, year, book, actNumber } =
      formMethods.getValues();

    const serial = generateCivilRegistrySerial({
      state,
      municipality,
      year,
      book,
      actNumber,
    });
    formMethods.setValue("nationalId", serial);
  };

  const handleRelationshipChange = (value: Key | null) => {
    setRelationship(value);
    if (value !== "HIJO") {
      setHasNoId(false);
      setIsSpecial(false);
    }
  };

  const handleAddBeneficiary = async (e: FieldValues) => {
    const birthDate = e.birthDate;
    const rel = relationship as IBeneficiary["relationship"];

    if (rel === "HIJO" && !isSpecial) {
      const age = calculateAge(birthDate);
      if (age > 25) {
        toast.danger("Exclusión por Edad", {
          description:
            "El sistema no permite el ingreso de hijos mayores de 25 años en la cobertura actual.",
        });
        return;
      }
    }

    const newFamiliar: IUserRegisterData = {
      gender: e.gender,
      nationality: e.nationality,
      nationalId: e.nationalId,
      firstName: e.firstName,
      lastName: e.lastName,
      birthDate,
      placeOfBirth: e.placeOfBirth,
      relationship: rel,
      phone: e.phone,
      isSpecial,
      ...(hasNoId
        ? {
            birthCertificateDetails: {
              actNumber: e.actNumber,
              book: e.book,
              year: e.year,
              state: e.state,
              municipality: e.municipality,
            },
          }
        : {}),
    };
    await addBeneficiary(newFamiliar);
    toast.success("Beneficiario Encolado", {
      description: `${newFamiliar.firstName} fue agregado a tu propuesta de carga familiar.`,
    });
    handleClose(false);
  };

  const handleClose = (e: boolean) => {
    if (isLoadingAddBeneficiary) return;
    onClose(e);
  };

  return (
    <Modal
      title="Registrar Familiar Directo"
      isOpen={open}
      onOpenChange={handleClose}
      size="lg"
    >
      <CForm
        onFinish={(e) => {
          handleAddBeneficiary(e);
        }}
        form={formMethods}
        className="space-y-4"
      >
        <CForm.Item name="relationship" className="flex flex-col" required>
          <Select
            label="Parentesco"
            required
            className="font-semibold w-full"
            onChange={handleRelationshipChange}
            options={[
              { label: "MADRE", value: "MADRE" },
              { label: "PADRE", value: "PADRE" },
              { label: "PAREJA", value: "PAREJA" },
              { label: "HIJO", value: "HIJO" },
            ]}
          />
        </CForm.Item>

        {relationship === "HIJO" && (
          <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <Checkbox isSelected={hasNoId} onChange={setHasNoId}>
              <Checkbox.Content className="flex flex-row gap-2">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                Sin Cédula
              </Checkbox.Content>
            </Checkbox>
            <CForm.Item name="isSpecial" className="flex flex-col">
              <Checkbox
                isSelected={isSpecial}
                onChange={setIsSpecial}
                className="text-xs font-bold text-rose-600"
              >
                <Checkbox.Content className="flex flex-row gap-2">
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  Con Discapacidad
                </Checkbox.Content>
              </Checkbox>
            </CForm.Item>
          </div>
        )}

        {hasNoId ? (
          <div className="space-y-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
            <h4 className="text-xs font-black text-[#006ae1] uppercase tracking-wider flex items-center gap-1">
              <CalendarDays size={14} /> Datos del Acta de Nacimiento
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CForm.Item name="actNumber" className="flex flex-col" required>
                <Input
                  name="actNumber"
                  label="N° Acta"
                  placeholder="Ej: 1"
                  onChange={generateNationalId}
                  type="number"
                />
              </CForm.Item>
              <CForm.Item name="book" className="flex flex-col" required>
                <Input
                  name="book"
                  label="N° Folio"
                  placeholder="Ej: 101"
                  onChange={generateNationalId}
                  type="number"
                />
              </CForm.Item>
              <CForm.Item name="year" className="flex flex-col" required>
                <Input
                  name="year"
                  label="Año Registro"
                  placeholder="Ej: 2024"
                  onChange={generateNationalId}
                  type="number"
                />
              </CForm.Item>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CForm.Item name="state" className="flex flex-col" required>
                <Select
                  label="Estado"
                  placeholder="Seleccione un Estado"
                  name="state"
                  required
                  options={STATE_OPTIONS}
                  value={state}
                  onChange={(e) => [
                    generateNationalId(),
                    setState(e as keyof typeof MUNICIPALITIES),
                  ]}
                />
              </CForm.Item>
              <CForm.Item
                name="municipality"
                className="flex flex-col"
                required
              >
                <Select
                  label="Municipio"
                  required
                  placeholder="Seleccione un Municipio"
                  name="municipality"
                  disabled={!state}
                  onChange={generateNationalId}
                  options={state ? getMunicipiosOptions(state) : []}
                />
              </CForm.Item>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-row gap-1">
              <CForm.Item name="nationality" className="flex flex-col" required>
                <Select
                  label="Tipo"
                  placeholder="V"
                  required
                  disabled={!relationship}
                  className="w-[55px]"
                  defaultValue="V"
                  options={[
                    { label: "V", value: "V" },
                    { label: "E", value: "E" },
                  ]}
                />
              </CForm.Item>
              <CForm.Item name="nationalId" className="flex flex-col" required>
                <Input
                  label="Cédula de Identidad"
                  placeholder="Ej: 30444555"
                  type="number"
                  disabled={!relationship}
                  className="w-[150px]"
                  required
                />
              </CForm.Item>
            </div>
            <CForm.Item name="gender" className="flex flex-col" required>
              <Select
                label="Género"
                required
                placeholder="Seleccione un Género"
                disabled={!relationship}
                options={[
                  { label: "Masculino", value: "M" },
                  { label: "Femenino", value: "F" },
                ]}
              />
            </CForm.Item>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CForm.Item name="firstName" className="flex flex-col" required>
            <Input
              name="firstName"
              label="Nombres"
              placeholder="Ej: Juan Carlos"
              required
              disabled={!relationship}
            />
          </CForm.Item>
          <CForm.Item name="lastName" className="flex flex-col" required>
            <Input
              name="lastName"
              label="Apellidos"
              placeholder="Ej: Pérez Cotis"
              disabled={!relationship}
              required
            />
          </CForm.Item>
          <CForm.Item name="birthDate" className="flex flex-col" required>
            <Input
              name="birthDate"
              label="Fecha de Nacimiento"
              required
              type="date"
              disabled={!relationship}
            />
          </CForm.Item>
          <CForm.Item name="placeOfBirth" className="flex flex-col" required>
            <Input
              name="placeOfBirth"
              label="Lugar de Nacimiento"
              placeholder="Ej: Coro, Edo. Falcón"
              disabled={!relationship}
              required
            />
          </CForm.Item>
        </div>

        <div className="p-0 pt-2 flex justify-end gap-3">
          <Button
            variant="outline"
            className="font-bold rounded-xl h-10 border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={() => handleClose(false)}
            isDisabled={isLoadingAddBeneficiary}
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="font-bold bg-[#006ae1] text-white rounded-xl h-10 px-5 shadow-sm"
            isPending={isLoadingAddBeneficiary}
          >
            Registrar en Carga
          </Button>
        </div>
      </CForm>
    </Modal>
  );
};

export default AddNewBeneficiaryModal;
