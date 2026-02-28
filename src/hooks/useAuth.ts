import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import { setCredentials, logout } from '@/store/authSlice'
import { ENDPOINTS, ROUTES } from '@/constants'

export const useLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const data = await api.post(ENDPOINTS.LOGIN, credentials)
      return data
    },
    onSuccess: (data: any) => {
      dispatch(setCredentials({ token: data.data.token, user: data.data.user }))
      if (data.data.user.role === 'ADMIN') {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.HOME)
      }
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: {
      name: string
      email: string
      phone?: string
      password: string
    }) => {
      const data = await api.post(ENDPOINTS.REGISTER, payload)
      return data
    },
  })
}

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }
}