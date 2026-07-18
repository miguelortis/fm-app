import { IUser, IUserUpdateData } from "@/types/api/user.interface";
import { apiProxy } from "../api/proxy-client";

export const userService = {
  async getCurrentUser() {
    const data = await apiProxy.get("/users/me");
    return (data.user ?? data) as IUser;
  },

  async updateProfile(profileData: IUserUpdateData) {
    const data = await apiProxy.put(`/users/profile`, profileData);
    return data;
  },

  async updateStatusToProcessing(userId: string | undefined) {
    const data = await apiProxy.put(`users/processing-status/${userId}`, {});
    return data;
  },

  async deleteUser(userId: string) {
    const data = await apiProxy.delete(`/users/${userId}`);
    return data;
  },
};
