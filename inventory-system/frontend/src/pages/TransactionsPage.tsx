import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '../api/transactions.api'
import TransactionForm from '../features/transactions/TransactionForm'
import TransactionTable from '../features/transactions/TransactionTable'

const TransactionsPage = (): JSX.Element => {
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const { data } = useQuery({ queryKey: ['transactions', { page }], queryFn: fetchTransactions })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <button onClick={() => setOpen(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-white">New Transaction</button>
      </div>
      <TransactionTable transactions={data?.data ?? []} />
      <TransactionForm open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default TransactionsPage
