"use client";

import { useQuery } from "@tanstack/react-query";
import { permissionService } from "@/core/services/permission.service";

// Hook para obtener todos los permisos (Lectura)
export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: permissionService.getPermissions,
    retry: false,
    staleTime: 5 * 60 * 1000, // Mantiene los permisos frescos en caché por 5 minutos
  });
};
