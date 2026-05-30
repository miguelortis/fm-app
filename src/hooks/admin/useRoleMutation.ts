"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/core/services/role.service";
import { IRole } from "@/types/api/role.interface";

// Hook para obtener el listado de roles (Lectura)
export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getRoles,
    retry: false,
  });
};

// Hook para crear un nuevo rol (Escritura)
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.createRole,
    onSuccess: () => {
      // Invalida la caché de roles para refrescar la lista al instante
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

// Hook para actualizar un rol (Modificación)
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; permissions: string[] };
    }) => roleService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

// Hook para eliminar un rol (Borrado)
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
