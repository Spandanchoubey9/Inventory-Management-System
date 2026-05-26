interface TransactionTableProps {
  transactions: Array<{ id: string; type: string; quantity: number; createdAt: string; product?: { price: number } }>
  formatCurrency: (amount: number) => string
  onView: (id: string) => void
}

const TransactionTable = ({ transactions, formatCurrency, onView }: TransactionTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-slate-900/70">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 dark:bg-slate-800/70">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Est. Value</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{transaction.type}</td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{transaction.quantity}</td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{formatCurrency((transaction.product?.price ?? 0) * transaction.quantity)}</td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{new Date(transaction.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onView(transaction.id)} className="rounded-lg border px-3 py-1 text-sm text-sky-700 hover:bg-sky-50">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
