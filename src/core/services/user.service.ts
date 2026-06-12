import { IUser } from "@/types/api/user.interface";
import { apiProxy } from "../api/proxy-client";

export const userService = {
  async getCurrentUser() {
    const data = await apiProxy.get("/users/me");
    return (data.user ?? data) as IUser;
  },
};
