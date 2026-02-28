import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.CATEGORIES)
      return data.data.categories
    },
  })
}