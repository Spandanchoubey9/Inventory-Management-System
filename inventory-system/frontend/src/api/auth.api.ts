import api from './axios'
import type { User } from '../types'

export interface LoginResult {
  user: User
  accessToken: string
  refreshToken: string
}

export const registerRequest = async (payload: { name: string; email: string; password: string }): Promise<LoginResult> => {
  const response = await api.post('/api/v1/auth/register', payload)
  return response.data.data
}

export const loginRequest = async (payload: { email: string; password: string }): Promise<LoginResult> => {
  const response = await api.post('/api/v1/auth/login', payload)
  return response.data.data
}

export const refreshRequest = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await api.post('/api/v1/auth/refresh', { refreshToken })
  return response.data.data
}

export const googleLoginRequest = async (payload: { credential: string }): Promise<LoginResult> => {
  const response = await api.post('/api/v1/auth/google', payload)
  return response.data.data
}

export const logoutRequest = async (refreshToken: string): Promise<void> => {
  await api.post('/api/v1/auth/logout', { refreshToken })
}
