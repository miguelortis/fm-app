import { IBeneficiary } from "@/types/api"; // Tus interfaces compartidas
import { apiProxy } from "../api/proxy-client";
import { BaseData } from "../api/types/proxy-client.interface";

export const beneficiaryService = {
  createOrFind: async (
    payload: Omit<IBeneficiary, "_id" | "civilRegistrySerial">,
  ): Promise<IBeneficiary> => {
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
};
