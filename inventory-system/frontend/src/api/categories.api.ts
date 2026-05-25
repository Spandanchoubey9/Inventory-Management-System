import api from './axios'

export interface Category {
  id: string
  name: string
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/v1/categories')
  return response.data.data
}
