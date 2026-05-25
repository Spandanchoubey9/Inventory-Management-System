interface AuditEntry {
  id: string
  action: string
  entity: string
  entityId: string
  performedBy: string
  details: string
  createdAt: string
}

interface AuditTableProps {
  audits: AuditEntry[]
}

const AuditTable = ({ audits }: AuditTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Entity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Details</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {audits.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-3 text-sm text-slate-700">{entry.action}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{entry.entity}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{entry.performedBy}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{entry.details}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{new Date(entry.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AuditTable
