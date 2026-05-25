import axios from 'axios'
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'
import { getAuthStore } from '../store/authStore'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000' })

let refreshing = false
let refreshPromise: Promise<void> | null = null

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const store = getAuthStore()
  if (store.accessToken) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${store.accessToken}`
    } as AxiosRequestHeaders
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const store = getAuthStore()

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!refreshing) {
        refreshing = true
        refreshPromise = api.post('/api/v1/auth/refresh', { refreshToken: store.refreshToken })
          .then((response) => {
            if (store.user) {
              store.setAuth(store.user, response.data.data.accessToken, response.data.data.refreshToken)
            }
          })
          .catch(() => {
            store.clearAuth()
            window.location.href = '/login'
          })
          .finally(() => {
            refreshing = false
          })
      }

      await refreshPromise
      originalRequest._retry = true
      return api(originalRequest)
    }

    return Promise.reject(error)
  }
)

export default api
