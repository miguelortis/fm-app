import { IPermission } from "./permissions.interface";

export interface IRole {
  [key: string]: unknown;
  _id?: string;
  name: string;
  slug?: string;
  permissions?: IPermission[]; // Aquí guardamos los slugs de los permisos asociados a este rol
  isActive?: boolean;
  isRoot?: boolean; // Para marcar roles que tienen acceso total (como admin)
}

// Para creación, no necesitamos el ID y el permissions puede ser un array de strings (slugs) en lugar de objetos completos
export type IRoleCreate = Omit<IRole, "_id"> & {
  permissions: string[]; // Solo los slugs de los permisos al crear o actualizar
};
// Para actualización, el id es obligatorio y el permissions sigue siendo un array de ids de permisos
export type IRoleUpdate = Omit<IRole, "_id"> & {
  permissions: string[]; // Solo los slugs de los permisos al crear o actualizar
};
