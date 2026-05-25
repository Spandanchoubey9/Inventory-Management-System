import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../../lib/schemas'
import { createTransactionRequest } from '../../api/transactions.api'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
}

const TransactionForm = ({ open, onClose }: TransactionFormProps): JSX.Element | null => {
  const form = useForm({ resolver: zodResolver(transactionSchema), defaultValues: { productId: '', type: 'STOCK_IN', quantity: 1, note: '' } })

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New Transaction</h2>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
          await createTransactionRequest(data)
          onClose()
        })}>
          <div>
            <label className="block text-sm text-slate-700">Product ID</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" {...form.register('productId')} />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Type</label>
            <select className="mt-1 w-full rounded-lg border px-3 py-2" {...form.register('type')}>
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="RETURN">Return</option>
            </select>
          </div>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white" type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm
