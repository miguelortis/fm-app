"use client";

import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { userService } from "@/core/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { IUser } from "@/types/api";

export const useCurrentUser = () => {
  const { user, token, setUser, logout } = useAuthStore();
  const cookieToken = getCookie("auth_token") as string | undefined;
  const authToken = token ?? cookieToken ?? null;

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: userService.getCurrentUser,
    enabled: !user && !!authToken,
    retry: false,
    /* onSuccess: (currentUser: IUser) => {
      setUser(currentUser, authToken);
    }, */
    /* onError: () => {
      logout();
    }, */
  });
};
