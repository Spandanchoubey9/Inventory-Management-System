import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const navigate = useNavigate()

  return useMemo(
    () => ({
      user,
      setAuth,
      clearAuth,
      logout: () => {
        clearAuth()
        navigate('/login')
      }
    }),
    [clearAuth, navigate, setAuth, user]
  )
}
