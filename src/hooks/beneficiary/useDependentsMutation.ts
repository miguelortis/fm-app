import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { beneficiaryService } from "@/core/services/beneficiary.service";

export function useToggleDocumentCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: beneficiaryService.toggleDocumentCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-policies-audit"] });
    },
  });
}
