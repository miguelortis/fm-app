import { IPermission } from "./permissions.interface";

export interface IRole {
  _id?: string;
  name: string;
  slug: string;
  permissions?: IPermission[]; // Aquí guardamos los slugs de los permisos asociados a este rol
  isActive?: boolean;
  isRoot?: boolean; // Para marcar roles que tienen acceso total (como admin)
}
