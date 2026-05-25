import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string
  refreshToken: string
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: '',
      refreshToken: '',
      setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: '', refreshToken: '' })
    }),
    {
      name: 'inventory-auth',
      getStorage: () => localStorage
    }
  )
)

export const getAuthStore = (): AuthState => useAuthStore.getState()
