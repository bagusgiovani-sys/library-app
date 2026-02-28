import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'

export const useAuthors = (q?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHORS, q],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.AUTHORS, { params: { q } })
      return data
    },
  })
}

export const usePopularAuthors = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHORS_POPULAR],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.AUTHORS_POPULAR, { params: { limit } })
      return data.data.authors
    },
  })
}

export const useAuthorBooks = (id: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHOR_BOOKS, id, params],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.AUTHOR_BOOKS(id), { params })
      return data
    },
    enabled: !!id,
  })
}