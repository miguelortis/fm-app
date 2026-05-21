import api from "../api/axios.instance";
import { IUser } from "@/types/api/user.interface";

export const userService = {
  async getCurrentUser() {
    const { data } = await api.get("/users/me");
    return (data.user ?? data) as IUser;
  },
};
