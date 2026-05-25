import api from './axios'

export interface AuditLogEntry {
  id: string
  action: string
  entity: string
  entityId: string
  performedBy: string
  details: string
  createdAt: string
}

export const fetchAuditLogs = async ({ queryKey }: { queryKey: [string, { page: number }] }): Promise<AuditLogEntry[]> => {
  const [, { page }] = queryKey
  const response = await api.get('/api/v1/audit-logs', { params: { page } })
  return response.data.data
}
