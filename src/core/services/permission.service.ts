import api from "../api/axios.instance";
import { IPermission } from "@/types/api/permissions.interface";

export const permissionService = {
  // Obtener todos los permisos disponibles en el sistema
  async getPermissions() {
    const { data } = await api.get("/roles/permissions");
    return data as IPermission[];
  },
};
