import { IPolicy, IRenewPolicyPayload } from "@/types/api";
import { apiProxy } from "../api/proxy-client";

export const policyService = {
  renew: async (payload: IRenewPolicyPayload): Promise<IPolicy> => {
    const data = await apiProxy.post<IPolicy>("/policies/renew", payload);
    return data;
  },

  pendingReviews: async (): Promise<IPolicy[]> => {
    const data = await apiProxy.get<IPolicy[]>("/policies/pending-reviews");
    return data;
  },

  checkCoverage: async (
    pacienteId: string,
    period?: string,
  ): Promise<IPolicy | null> => {
    const params = new URLSearchParams();
    params.append("pacienteId", pacienteId);
    if (period) params.append("period", period);

    const data = await apiProxy.get<IPolicy | null>(
      `/policies/coverage-check?${params.toString()}`,
    );
    return data;
  },
};
