interface TransactionTableProps {
  transactions: Array<{ id: string; type: string; quantity: number; createdAt: string }>
}

const TransactionTable = ({ transactions }: TransactionTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-3 text-sm text-slate-700">{transaction.type}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{transaction.quantity}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{new Date(transaction.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
