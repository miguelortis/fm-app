import { IRole } from "./role.interface";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  nationalId: string; // Cédula o ID generado para menores
  email?: string;
  role: IRole; // Relación con el rol del usuario
  isRoot?: boolean; // Para marcar usuarios con acceso total (como admin)

  // Relaciones familiares (Recursividad)
  familyGroup: string[] | IUser[]; // IDs de familiares o los objetos completos si usas populate
  parentPrimary?: string | IUser; // Quién es el titular responsable

  // Gestión de beneficios y cobertura
  coverage: {
    planId?: string; // ID del Plan asociado
    limit: number; // Límite monetario o de puntos (si aplica)
    used: number; // Consumo acumulado
    status: "active" | "suspended";
  };

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IUserRegisterData = Omit<
  IUser,
  | "_id"
  | "roles"
  | "permissions"
  | "familyGroup"
  | "parentPrimary"
  | "coverage"
  | "isActive"
  | "createdAt"
  | "updatedAt"
> & {
  password: string;
};
// Tipos auxiliares para mayor orden
