import { IUser } from "@/types/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/core/services/auth.service";

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
      logout: async () => {
        // 1. Limpiamos de inmediato el estado de Zustand (UI reactiva instantánea)
        set({ user: null, token: null, isHydrated: false });

        try {
          // 2. 🌟 LE DECIMOS AL SERVIDOR QUE DESTRUYA LA COOKIE HTTPONLY
          await authService.logout();
        } catch (e) {
          console.error("Error al destruir la cookie en el servidor:", e);
        }
      },
    }),
    {
      name: "unefm-salud-auth", // Nombre de la llave en localStorage
    },
  ),
);
