import { useQuery } from "@tanstack/react-query";
import { policyService } from "@/core/services/policy.service";

// Hook para obtener reseñas pendientes
export const usePendingReviewsMutation = () => {
  return useQuery({
    queryKey: ["pending-reviews"],
    queryFn: policyService.pendingReviews,
  });
};
