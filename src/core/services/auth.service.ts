import { apiProxy } from "../api/proxy-client";
import { IUser, IUserRegisterData } from "@/types/api/user.interface";

// 🌟 Definimos la interfaz exacta de lo que devuelve el Login de NestJS
interface LoginResponse {
  user: IUser;
  access_token: string;
}

export const authService = {
  // Le pasamos <LoginResponse> al método .post para que herede el tipado correcto
  async login(nationalId: string, password: string) {
    return apiProxy.post<LoginResponse>("auth/login", {
      username: nationalId,
      password,
    });
  },

  async register(userData: IUserRegisterData) {
    // Si tu registro devuelve un objeto con el usuario, puedes tiparlo igual aquí
    return apiProxy.post<{ user: IUser }>("auth/register", userData);
  },

  async forgotPassword(email: string) {
    return apiProxy.post("auth/forgot-password", { email });
  },

  async logout() {
    await apiProxy.post("auth/logout", {});
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};
