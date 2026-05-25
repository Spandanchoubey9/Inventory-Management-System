import api from './axios'
import type { Supplier } from '../types'

export const fetchSuppliers = async () => {
  const response = await api.get('/api/v1/suppliers')
  return response.data.data
}

export interface SupplierPayload {
  name: string
  email?: string
  phone?: string
  address?: string
}

export const createSupplier = async (payload: SupplierPayload): Promise<Supplier> => {
  const response = await api.post('/api/v1/suppliers', payload)
  return response.data.data
}

export const getSupplier = async (id: string): Promise<Supplier> => {
  const response = await api.get(`/api/v1/suppliers/${id}`)
  return response.data.data
}

export const updateSupplier = async ({ id, payload }: { id: string; payload: Partial<SupplierPayload> }): Promise<Supplier> => {
  const response = await api.patch(`/api/v1/suppliers/${id}`, payload)
  return response.data.data
}

export const deleteSupplier = async (id: string): Promise<Supplier> => {
  const response = await api.delete(`/api/v1/suppliers/${id}`)
  return response.data.data
}
