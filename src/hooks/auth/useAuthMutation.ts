import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authService } from "@/core/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginFormData } from "@/lib/validations/auth.schema";
import { IUser, IUserRegisterData } from "@/types/api/user.interface";
import { toast } from "@heroui/react";
import { useAuthStore } from "@/store/auth.store";

// Hook para Login
export const useLoginMutation = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ nationalId, password }: LoginFormData) =>
      authService.login(nationalId, password),

    // 🌟 TypeScript ahora compila feliz porque la data viene tipada desde el servicio
    onSuccess: (data) => {
      const { user } = data;
      const authToken = data.access_token ?? null;

      // 1. Guardar en Store Global (Zustand)
      setUser(user, authToken);

      toast.success("¡Bienvenido de vuelta!", {
        description: `Hola ${user.firstName}, has iniciado sesión correctamente.`,
      });

      // 2. Redirección limpia usando replace para evitar el bucle de transiciones
      router.replace("/dashboard");
    },

    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const apiMessage = error.response?.data?.message;
      const message = Array.isArray(apiMessage)
        ? apiMessage[0]
        : apiMessage || "Error en el servidor";

      toast.danger("Error de acceso", {
        description: message,
      });
    },
  });
};

// Hook para Registro
export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: IUserRegisterData) => authService.register(userData),
    onSuccess: () => {
      toast.success("¡Bienvenido de vuelta!", {
        description: "Tu cuenta ha sido creada. Ya puedes iniciar sesión.",
      });
      router.replace("/login");
    },
    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const apiMessage = error.response?.data?.message;
      toast.danger("Error en registro", {
        description: Array.isArray(apiMessage)
          ? apiMessage[0]
          : apiMessage || "No se pudo crear la cuenta",
      });
    },
  });
};

// Hook para Olvido de Contraseña
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success("Correo enviado", {
        description: "Revisa tu bandeja de entrada para restablecer tu clave.",
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.danger("Error", {
        description:
          error.response?.data?.message || "No encontramos ese correo",
      });
    },
  });
};
