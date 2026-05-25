import api from './axios'
import type { Transaction } from '../types'

export const fetchTransactions = async ({ queryKey }: { queryKey: [string, { page: number }] }) => {
  const [, { page }] = queryKey
  const response = await api.get('/api/v1/transactions', { params: { page } })
  return response.data.data
}

export const createTransactionRequest = async (payload: unknown) => {
  const response = await api.post('/api/v1/transactions', payload)
  return response.data.data
}

export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await api.get(`/api/v1/transactions/${id}`)
  return response.data.data
}
