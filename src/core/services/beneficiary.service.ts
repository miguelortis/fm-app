import { IBeneficiary, IUserRegisterData } from "@/types/api"; // Tus interfaces compartidas
import { apiProxy } from "../api/proxy-client";
import { BaseData } from "../api/types/proxy-client.interface";

export const beneficiaryService = {
  createOrFind: async (payload: IUserRegisterData): Promise<IBeneficiary> => {
    const data = await apiProxy.post<IBeneficiary>("/beneficiaries", payload);
    return data;
  },

  toggleDocumentCheck: async (payload: {
    titularId: string;
    beneficiaryId: string;
    documentKey: string;
    isProvided: boolean;
  }): Promise<BaseData> => {
    const data = await apiProxy.patch(
      `/beneficiaries/admin/audit/${payload.titularId}/beneficiary/${payload.beneficiaryId}/check-document`,
      {
        documentKey: payload.documentKey,
        isProvided: payload.isProvided,
      },
    );
    return data;
  },

  getMyCharge: async () => {
    const data = await apiProxy.get<IBeneficiary[]>("/beneficiaries/my-charge");
    return data;
  },

  deleteBeneficiary: async (id: string) => {
    const data = await apiProxy.delete<IBeneficiary[]>(`/beneficiaries/${id}`);
    return data;
  },
};
