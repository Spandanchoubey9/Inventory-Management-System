interface SupplierTableProps {
  suppliers: Array<{ id: string; name: string; email?: string; phone?: string }>
}

const SupplierTable = ({ suppliers }: SupplierTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="px-4 py-3 text-sm text-slate-700">{supplier.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{supplier.email ?? '-'}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{supplier.phone ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SupplierTable
