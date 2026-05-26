import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, type ProductPayload } from '../../api/products.api'
import { fetchCategories, type Category } from '../../api/categories.api'
import { createProductSchema } from '../../lib/schemas'

interface ProductFormProps {
  open: boolean
  onClose: () => void
}

const ProductForm = ({ open, onClose }: ProductFormProps): JSX.Element | null => {
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState('')
  const { data: categories, isLoading } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategories })

  const createProductMutation = useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      onClose()
    }
  })

  const form = useForm<ProductPayload>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      categoryId: '',
      price: 0,
      lowStockThreshold: 10,
      imageUrl: ''
    }
  })

  const handleSubmit = async (data: ProductPayload): Promise<void> => {
    try {
      setFormError('')
      await createProductMutation.mutateAsync(data)
      form.reset({ name: '', sku: '', description: '', categoryId: '', price: 0, lowStockThreshold: 10, imageUrl: '' })
    } catch (error) {
      setFormError((error as any)?.response?.data?.error?.message ?? 'Unable to create product')
    }
  }

  const submitText = createProductMutation.isLoading ? 'Saving...' : 'Save'

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-blue-950 dark:ring-1 dark:ring-blue-700/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-blue-100">New Product</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-blue-200">Close</button>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Name</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50 dark:placeholder:text-blue-200/70" {...form.register('name')} />
            {form.formState.errors.name?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">SKU</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50 dark:placeholder:text-blue-200/70" {...form.register('sku')} />
            {form.formState.errors.sku?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.sku.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Category</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50"
              {...form.register('categoryId')}
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {form.formState.errors.categoryId?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.categoryId.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Price</label>
            <input
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50 dark:placeholder:text-blue-200/70"
              {...form.register('price', { valueAsNumber: true })}
            />
            {form.formState.errors.price?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Low stock threshold</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50 dark:placeholder:text-blue-200/70"
              {...form.register('lowStockThreshold', { valueAsNumber: true })}
            />
            {form.formState.errors.lowStockThreshold?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.lowStockThreshold.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Image URL</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50 dark:placeholder:text-blue-200/70" {...form.register('imageUrl')} />
            {form.formState.errors.imageUrl?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-blue-100">Description</label>
            <textarea className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-50 dark:placeholder:text-blue-200/70" {...form.register('description')} rows={3} />
            {form.formState.errors.description?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-slate-700 dark:border-blue-600 dark:bg-blue-900/50 dark:text-blue-100">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-white dark:bg-blue-600 dark:hover:bg-blue-500">{submitText}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
