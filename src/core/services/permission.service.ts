import { apiProxy } from "../api/proxy-client";

export const permissionService = {
  // Obtener todos los permisos disponibles en el sistema
  async getPermissions() {
    const data = await apiProxy.get("/roles/permissions");
    return data;
  },
};
