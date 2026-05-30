import api from "../api/axios.instance";
import { IRole } from "@/types/api/role.interface";

export const roleService = {
  // Obtener todos los roles
  async getRoles() {
    const { data } = await api.get("/roles");
    return data as IRole[];
  },

  // Crear un nuevo rol
  async createRole(roleData: { name: string; permissions: string[] }) {
    const { data } = await api.post("/roles", roleData);
    return data as IRole;
  },

  // Actualizar un rol existente
  async updateRole(
    id: string,
    roleData: { name: string; permissions: string[] },
  ) {
    const { data } = await api.put(`/roles/${id}`, roleData);
    return data as IRole;
  },

  // Eliminar un rol
  async deleteRole(id: string) {
    const { data } = await api.delete(`/roles/${id}`);
    return data;
  },
};
