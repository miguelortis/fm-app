import api from "../api/axios.instance";
import { setCookie, deleteCookie } from "cookies-next";
import { IUser, IUserRegisterData } from "@/types/api/user.interface";

export const authService = {
  // Login: Ya lo tenías perfecto
  async login(nationalId: string, password: string) {
    const { data } = await api.post("/auth/login", {
      username: nationalId,
      password,
    });

    // Token por 8 horas para coincidir con el backend
    setCookie("auth_token", data.access_token, { maxAge: 60 * 60 * 8 });

    return data;
  },

  // Registro: Conectamos con el endpoint de creación de usuarios
  async register(userData: IUserRegisterData) {
    const { data } = await api.post("/auth/register", userData);

    // Si tu API hace login automático al registrar, guardamos el token
    if (data.access_token) {
      setCookie("auth_token", data.access_token, { maxAge: 60 * 60 * 8 });
    }

    return data.user as IUser;
  },

  // Recuperación: Envío de correo para resetear clave
  async forgotPassword(email: string) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  logout() {
    deleteCookie("auth_token");
    window.location.href = "/login";
  },
};
