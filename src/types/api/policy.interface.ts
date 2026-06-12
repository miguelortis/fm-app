import { IBeneficiary } from "./beneficiary.interface";
import { IPlan } from "./plan.interface";
import { IUser } from "./user.interface";

export interface IPolicyBeneficiary {
  beneficiaryId: IBeneficiary; // ID del beneficiario (puede ser User o Beneficiary)
  onModel: "User" | "Beneficiary"; // Para saber en qué colección buscar
  relationship: "PAREJA" | "MADRE" | "PADRE" | "HIJO"; // Parentesco con el titular
  ageAtSubscription?: number; // Edad al momento de la inscripción en la póliza
  hasAllDocuments?: boolean; // Si el beneficiario tiene toda la documentación requerida
  isSpecial?: boolean; // Si es un caso especial (ej: niños sin cédula)
}

export interface IPolicy {
  _id: string;
  period: string;
  titular: IUser;
  planId: IPlan;
  status: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "EXPIRED";
  beneficiaries: IPolicyBeneficiary[];
  createdAt: string;
}

export type IPolicyCreate = Omit<
  IPolicy,
  "_id" | "status" | "createdAt" | "titular" | "planId"
> & {
  planId: string; // Solo los slugs de los permisos al crear o actualizar
};

export interface IRenewPolicyPayload {
  [key: string]: unknown; // Permite cualquier otro campo adicional
  period: string;
  planId: string;
  beneficiaries: {
    beneficiaryId: string;
    onModel: "User" | "Beneficiary";
    relationship: "PAREJA" | "MADRE" | "PADRE" | "HIJO";
  }[];
}
