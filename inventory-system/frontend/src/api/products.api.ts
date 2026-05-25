import api from './axios'
import type { Product } from '../types'

export interface ProductPayload {
  name: string
  sku: string
  description?: string
  categoryId: string
  price: number
  lowStockThreshold?: number
  imageUrl?: string
}

export interface ProductListResponse {
  data: Product[]
  meta: { page: number; limit: number; total: number }
}

export const fetchProducts = async ({ queryKey }: { queryKey: [string, { page: number; search: string }] }): Promise<ProductListResponse> => {
  const [, { page, search }] = queryKey
  const response = await api.get('/api/v1/products', { params: { page, search } })
  return response.data.data
}

export const createProduct = async (payload: ProductPayload) => {
  const response = await api.post('/api/v1/products', payload)
  return response.data.data
}
