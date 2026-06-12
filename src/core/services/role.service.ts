import { IRoleCreate, IRoleUpdate } from "@/types/api";
import { apiProxy } from "../api/proxy-client";

export const roleService = {
  // Obtener todos los roles
  async getRoles() {
    const data = await apiProxy.get("/roles");
    return data;
  },

  // Crear un nuevo rol
  async createRole(roleData: IRoleCreate) {
    const data = await apiProxy.post("/roles", roleData);
    return data;
  },

  // Actualizar un rol existente
  async updateRole(id: string, roleData: IRoleUpdate) {
    const data = await apiProxy.put(`/roles/${id}`, roleData);
    return data;
  },

  // Eliminar un rol
  async deleteRole(id: string) {
    const data = await apiProxy.delete(`/roles/${id}`);
    return data;
  },
};
