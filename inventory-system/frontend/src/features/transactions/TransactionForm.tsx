import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../../lib/schemas'
import { createTransactionRequest } from '../../api/transactions.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
}

const TransactionForm = ({ open, onClose }: TransactionFormProps): JSX.Element | null => {
  const [formError, setFormError] = useState('')
  const queryClient = useQueryClient()
  const mutation = useMutation(createTransactionRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions'])
      onClose()
    }
  })
  const form = useForm({ resolver: zodResolver(transactionSchema), defaultValues: { productId: '', type: 'STOCK_IN', quantity: 1, note: '' } })

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-blue-950 dark:ring-1 dark:ring-blue-700/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-blue-100">New Transaction</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-blue-200">Close</button>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
          try {
            setFormError('')
            await mutation.mutateAsync(data)
          } catch (error: any) {
            setFormError(error?.response?.data?.error?.message ?? 'Failed to create transaction')
          }
        })}>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Product ID</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60" {...form.register('productId')} />
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Type</label>
            <select className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60" {...form.register('type')}>
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="RETURN">Return</option>
            </select>
          </div>
          {formError && <p className="text-sm text-rose-600">{formError}</p>}
          <button disabled={mutation.isLoading} className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50" type="submit">{mutation.isLoading ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm
