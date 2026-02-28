import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS, QUERY_KEYS } from '@/constants'

export const useCart = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.CART)
      return data
    },
  })
}

export const useCartCheckout = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CART_CHECKOUT],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.CART_CHECKOUT)
      return data
    },
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookId: number) => {
      const data = await api.post(ENDPOINTS.CART_ITEMS, { bookId })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (itemId: number) => {
      const data = await api.delete(ENDPOINTS.CART_ITEM(itemId))
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const data = await api.delete(ENDPOINTS.CART)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
    },
  })
}