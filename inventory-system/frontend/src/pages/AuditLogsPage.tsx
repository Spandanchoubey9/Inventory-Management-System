import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogs } from '../api/audit.api'
import AuditTable from '../features/audit/AuditTable'

const AuditLogsPage = (): JSX.Element => {
  const [page, setPage] = useState(1)
  const { data } = useQuery({ queryKey: ['audit-logs', { page }], queryFn: fetchAuditLogs })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Audit Logs</h1>
      <AuditTable audits={data ?? []} />
    </div>
  )
}

export default AuditLogsPage
