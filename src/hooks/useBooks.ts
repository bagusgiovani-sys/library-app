import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'
import type { Book, CreateBookPayload, UpdateBookPayload } from '@/types/book'

export const useBooks = (params?: {
  q?: string
  categoryId?: number
  authorId?: number
  minRating?: number
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.BOOKS, { params })
      return data
    },
  })
}

export const useBookDetail = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOK_DETAIL, id],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.BOOK_DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export const useRecommendedBooks = (params?: {
  by?: 'rating' | 'popular'
  categoryId?: number
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS_RECOMMEND, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.BOOKS_RECOMMEND, { params })
      return data
    },
    select: (data: any) => data.data.books as Book[],
  })
}

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateBookPayload) => {
      const data = await api.post(ENDPOINTS.BOOKS, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] })
    },
  })
}

export const useUpdateBook = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateBookPayload) => {
      const data = await api.put(ENDPOINTS.BOOK_DETAIL(id), payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOK_DETAIL, id] })
    },
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const data = await api.delete(ENDPOINTS.BOOK_DETAIL(id))
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] })
    },
  })
}