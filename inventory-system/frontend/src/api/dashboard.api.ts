import api from './axios'

export interface DashboardSummary {
  totalProducts: number
  totalSuppliers: number
  lowStockItems: number
  transactionsToday: number
}

export interface DashboardAnalyticsPoint {
  date: string
  value: number
}

export const fetchSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get('/api/v1/dashboard/summary')
  return response.data.data
}

export const fetchAnalytics = async (window: '7d' | '30d' | '90d'): Promise<DashboardAnalyticsPoint[]> => {
  const response = await api.get('/api/v1/dashboard/analytics', { params: { window } })
  return response.data.data
}

export const fetchNotifications = async () => {
  const response = await api.get('/api/v1/dashboard/notifications')
  return response.data.data
}
