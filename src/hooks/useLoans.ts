import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'
import type { CreateLoanPayload, CreateLoanFromCartPayload } from '@/types/loan'

export const useMyLoans = (params?: {
  status?: 'all' | 'active' | 'returned' | 'overdue'
  q?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOANS_MY, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.LOANS_MY, { params })
      return data
    },
  })
}

export const useBorrowBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateLoanPayload) => {
      const data = await api.post(ENDPOINTS.LOANS, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] })
    },
  })
}

export const useBorrowFromCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateLoanFromCartPayload) => {
      const data = await api.post(ENDPOINTS.LOANS_FROM_CART, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
    },
  })
}

export const useReturnBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const data = await api.patch(ENDPOINTS.LOAN_RETURN(id))
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] })
    },
  })
}