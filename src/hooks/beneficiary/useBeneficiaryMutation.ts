import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { beneficiaryService } from "@/core/services/beneficiary.service";
import { toast } from "@heroui/react";
import { AxiosError } from "axios";

export function useAddBeneficiaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: beneficiaryService.createOrFind,
    onSuccess: () => {
      // Invalida las queries de perfil o pólizas para refrescar la carga familiar en pantalla
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
    onError(error: AxiosError<AxiosError>, variables, onMutateResult, context) {
      toast.danger(error?.response?.data?.message);
    },
  });
}

export function useDeleteBeneficiary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: beneficiaryService.deleteBeneficiary,
    onSuccess: () => {
      // Invalida las queries de perfil o pólizas para refrescar la carga familiar en pantalla
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });
}

export function useGetMyDependents() {
  return useQuery({
    queryKey: ["beneficiaries"],
    queryFn: beneficiaryService.getMyCharge,
  });
}
