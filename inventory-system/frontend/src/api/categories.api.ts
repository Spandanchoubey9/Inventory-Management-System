import api from './axios'

export interface Category {
  id: string
  name: string
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/v1/categories')
  return response.data.data
}

export interface CategoryPayload {
  name: string
}

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const response = await api.post('/api/v1/categories', payload)
  return response.data.data
}

export const updateCategory = async ({ id, payload }: { id: string; payload: CategoryPayload }): Promise<Category> => {
  const response = await api.patch(`/api/v1/categories/${id}`, payload)
  return response.data.data
}

export const deleteCategory = async (id: string): Promise<Category> => {
  const response = await api.delete(`/api/v1/categories/${id}`)
  return response.data.data
}
