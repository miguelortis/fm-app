import { IUser } from "@/types/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deleteCookie } from "cookies-next";

interface AuthStore {
  user: IUser | null;
  token: string | null;
  isHydrated: boolean; // Para saber si ya intentamos cargar al usuario desde el token
  setUser: (user: IUser, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setUser: (user, token) => set({ user, token, isHydrated: true }),
      logout: () => {
        // Borrar cookie de sesión y limpiar el store
        try {
          deleteCookie("auth_token");
        } catch (e) {
          console.log(e);
        }

        set({ user: null, token: null, isHydrated: false });

        // Redirigir al login en cliente
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
    }),
    {
      name: "unefm-salud-auth", // Nombre de la llave en localStorage
    },
  ),
);
