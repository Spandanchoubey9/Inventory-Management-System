import api from './axios'

export const fetchSuppliers = async () => {
  const response = await api.get('/api/v1/suppliers')
  return response.data.data
}
