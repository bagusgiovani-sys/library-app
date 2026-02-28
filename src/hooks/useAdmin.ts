import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'
import type { AdminCreateLoanPayload, UpdateLoanPayload } from '@/types/loan'

export const useAdminOverview = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_OVERVIEW],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ADMIN_OVERVIEW)
      return data
    },
  })
}

export const useAdminBooks = (params?: {
  status?: 'all' | 'available' | 'borrowed' | 'returned'
  q?: string
  categoryId?: number
  authorId?: number
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_BOOKS, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ADMIN_BOOKS, { params })
      return data
    },
  })
}

export const useAdminLoans = (params?: {
  status?: 'all' | 'active' | 'returned' | 'overdue'
  q?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_LOANS, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ADMIN_LOANS, { params })
      return data
    },
  })
}

export const useAdminOverdueLoans = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_LOANS_OVERDUE, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ADMIN_LOANS_OVERDUE, { params })
      return data
    },
  })
}

export const useAdminCreateLoan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AdminCreateLoanPayload) => {
      const data = await api.post(ENDPOINTS.ADMIN_LOANS, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_LOANS] })
    },
  })
}

export const useAdminUpdateLoan = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateLoanPayload) => {
      const data = await api.patch(ENDPOINTS.ADMIN_LOAN(id), payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_LOANS] })
    },
  })
}

export const useAdminUsers = (params?: { q?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.ADMIN_USERS, { params })
      return data
    },
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const data = await api.delete(`/api/admin/books/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BOOKS] })
    },
  })
}

export const useAdminUpdateBook = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: any) => {
      const data = await api.patch(`/api/admin/books/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BOOKS] })
    },
  })
}