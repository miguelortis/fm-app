import { IRole } from "./role.interface";

export type IPersonalType = "DOCENTE" | "ADMINISTRATIVO" | "OBRERO";
export type IEmploymentType = "FIJO" | "CONTRATADO" | "JUBILADO";
export type IMaritalStatus =
  | "SOLTERO/A"
  | "CASADO/A"
  | "DIVORCIADO/A"
  | "VIUDO/A"
  | "OTROS";

export interface IBirthCertificateDetails {
  state: string;
  municipality: string;
  year: string;
  book: string;
  actNumber: string;
}

export interface IUser {
  _id: string;
  nationality: string;
  isTitular: boolean;
  firstName: string;
  lastName: string;
  nationalId: string; // Cédula o ID generado para menores
  email?: string;
  role?: IRole; // Relación con el rol del usuario
  refuseReason?: string;
  gender: "M" | "F";
  phone: string;
  isRoot?: boolean;
  personalType?: IPersonalType;
  birthDate: string;
  placeOfBirth: string;
  address?: string;
  dependencyArea?: string;
  bank?: string;
  accountNumber?: string;
  profession?: string;
  maritalStatus?: IMaritalStatus;
  // Gestión de beneficios y cobertura
  coverage?: {
    planId?: string; // ID del Plan asociado
    limit?: number; // Límite monetario o de puntos (si aplica)
    used?: number; // Consumo acumulado
    status?: "active" | "suspended";
  };
  birthCertificateDetails?: IBirthCertificateDetails;
  status:
    | "pending"
    | "processing"
    | "active"
    | "inactive"
    | "excluded"
    | "refused";
  createdAt?: string;
  updatedAt?: string;
  isSpecial?: boolean;
  employmentType?: IEmploymentType;
}

export type IUserRegisterData = Omit<
  IUser,
  | "_id"
  | "role"
  | "coverage"
  | "isActive"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "isTitular"
> & {
  password?: string;
  relationship?: "MADRE" | "PADRE" | "PAREJA" | "HIJO"; // Relación con el titular, si aplica
};

export type IUserUpdateData = Partial<IUser>;
