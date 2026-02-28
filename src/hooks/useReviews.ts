import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'
import type { CreateReviewPayload } from '@/types/review'

export const useBookReviews = (bookId: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS_BOOK, bookId, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.REVIEWS_BOOK(bookId), { params })
      return data
    },
    enabled: !!bookId,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const data = await api.post(ENDPOINTS.REVIEWS, payload)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS_BOOK, variables.bookId] })
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const data = await api.delete(ENDPOINTS.REVIEW(id))
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS_BOOK] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME_REVIEWS] })
    },
  })
}