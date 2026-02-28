import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { ENDPOINTS, QUERY_KEYS } from "@/constants";
import type { UpdateProfilePayload } from "@/types/user";

export const useMe = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ME);
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const data = await api.patch(ENDPOINTS.ME, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });
};

export const useMyLoansProfile = (params?: {
  status?: "BORROWED" | "LATE" | "RETURNED";
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ME_LOANS, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ME_LOANS, { params });
      return data;
    },
  });
};

export const useMyReviews = (params?: {
  q?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ME_REVIEWS, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ME_REVIEWS, { params });
      return data;
    },
  });
};
