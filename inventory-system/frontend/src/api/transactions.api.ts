import api from './axios'

export const fetchTransactions = async ({ queryKey }: { queryKey: [string, { page: number }] }) => {
  const [, { page }] = queryKey
  const response = await api.get('/api/v1/transactions', { params: { page } })
  return response.data.data
}

export const createTransactionRequest = async (payload: unknown) => {
  const response = await api.post('/api/v1/transactions', payload)
  return response.data.data
}
