"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/core/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@heroui/react";
import { AxiosError } from "axios";
import { IUser } from "@/types/api";

export const useCurrentUser = (token: string | undefined) => {
  const { user } = useAuthStore();
  const authToken = token ?? null;

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: userService.getCurrentUser,
    enabled: !!authToken,
    retry: false,
  });
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError(error) {
      toast.danger(error.message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      toast.success("Usuario eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
    onError(error) {
      toast.danger(error.message);
    },
  });
}

export function useUpdateStatusToProcessing() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateStatusToProcessing,
    onSuccess: (data) => {
      const user = data.user as IUser;
      const AccessToken = data.access_token as string;

      setUser(user, AccessToken);

      toast.success("Accion realizada con éxito");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError(error: AxiosError<{ message?: string }>) {
      toast.danger(error.response?.data?.message);
    },
  });
}
