import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions, getTransaction } from '../api/transactions.api'
import TransactionForm from '../features/transactions/TransactionForm'
import TransactionTable from '../features/transactions/TransactionTable'
import Modal from '../components/Modal'
import { useToastStore } from '../store/toastStore'
import { useUserPreferences } from '../hooks/useUserPreferences'

const TransactionsPage = (): JSX.Element => {
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [activeId, setActiveId] = useState<string | null>(null)
  const addToast = useToastStore((s) => s.addToast)
  const { formatCurrency, currency } = useUserPreferences()
  const { data } = useQuery({ queryKey: ['transactions', { page }], queryFn: fetchTransactions })
  const { data: activeTx } = useQuery({
    queryKey: ['transaction', activeId],
    queryFn: () => getTransaction(activeId ?? ''),
    enabled: Boolean(activeId)
  })
  const transactions = useMemo(() => {
    const rows = data?.data ?? []
    return filter === 'ALL' ? rows : rows.filter((item: any) => item.type === filter)
  }, [data, filter])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-800/70 dark:bg-blue-950/70">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-blue-100">Transactions</h1>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60">
            <option value="ALL">All Types</option>
            <option value="STOCK_IN">Stock In</option>
            <option value="STOCK_OUT">Stock Out</option>
            <option value="ADJUSTMENT">Adjustment</option>
            <option value="RETURN">Return</option>
          </select>
          <button onClick={() => setOpen(true)} className="rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-white">New Transaction</button>
        </div>
      </div>
      <TransactionTable transactions={transactions} formatCurrency={formatCurrency} onView={setActiveId} />
      <div className="flex justify-end gap-2">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Prev</button>
        <button onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5">Next</button>
      </div>
      <TransactionForm open={open} onClose={() => setOpen(false)} />
      <Modal title="Transaction Details" open={activeId !== null} onClose={() => setActiveId(null)}>
        {activeTx ? (
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Type:</span> {activeTx.type}</p>
            <p><span className="font-semibold">Quantity:</span> {activeTx.quantity}</p>
            <p><span className="font-semibold">Estimated Value ({currency}):</span> {formatCurrency((activeTx as any).product?.price ? (activeTx as any).product.price * activeTx.quantity : 0)}</p>
            <p><span className="font-semibold">Product ID:</span> {activeTx.productId}</p>
            <p><span className="font-semibold">Note:</span> {activeTx.note ?? '-'}</p>
            <p className="text-xs text-slate-500">Edit/Delete are not available for transactions in current backend permissions.</p>
          </div>
        ) : (
          <button onClick={() => addToast({ type: 'error', title: 'Load failed', message: 'Unable to fetch transaction details.' })} className="rounded-lg border px-3 py-2">Retry Notice</button>
        )}
      </Modal>
    </div>
  )
}

export default TransactionsPage
