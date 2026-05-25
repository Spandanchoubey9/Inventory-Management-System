interface SupplierTableProps {
  suppliers: Array<{ id: string; name: string; email?: string; phone?: string }>
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  canManage: boolean
}

const SupplierTable = ({ suppliers, onView, onEdit, onDelete, canManage }: SupplierTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="px-4 py-3 text-sm text-slate-700">{supplier.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{supplier.email ?? '-'}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{supplier.phone ?? '-'}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onView(supplier.id)} className="rounded-lg border px-3 py-1 text-sm text-sky-700">View</button>
                  <button disabled={!canManage} onClick={() => onEdit(supplier.id)} className="rounded-lg border px-3 py-1 text-sm text-amber-700 disabled:opacity-50">Edit</button>
                  <button disabled={!canManage} onClick={() => onDelete(supplier.id)} className="rounded-lg border px-3 py-1 text-sm text-rose-700 disabled:opacity-50">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SupplierTable
