import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beneficiaryService } from "@/core/services/beneficiary.service";

export function useBeneficiaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: beneficiaryService.createOrFind,
    onSuccess: () => {
      // Invalida las queries de perfil o pólizas para refrescar la carga familiar en pantalla
      queryClient.invalidateQueries({ queryKey: ["current-policy"] });
    },
  });
}
