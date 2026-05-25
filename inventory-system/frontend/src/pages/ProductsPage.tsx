import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteProduct, fetchProducts, updateProduct } from '../api/products.api'
import ProductTable from '../features/products/ProductTable'
import ProductForm from '../features/products/ProductForm'
import BulkImport from '../features/products/BulkImport'
import type { Product } from '../types'
import Modal from '../components/Modal'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { Search } from 'lucide-react'

const ProductsPage = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState(0)
  const [editThreshold, setEditThreshold] = useState(0)
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  const canManage = useAuthStore((s) => s.user?.role === 'ADMIN')
  const { data } = useQuery({ queryKey: ['products', { page, search }], queryFn: fetchProducts })
  const meta = data?.meta
  const products = useMemo(() => data?.data ?? [], [data])
  const paginated = products.slice(0, 10)

  const updateMutation = useMutation(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      setActive(null)
      addToast({ type: 'success', title: 'Product updated', message: 'Changes were saved successfully.' })
    },
    onError: (error: any) => addToast({ type: 'error', title: 'Update failed', message: error?.response?.data?.error?.message ?? 'Unable to update product.' })
  })
  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      setDeleteTarget(null)
      addToast({ type: 'success', title: 'Product deleted', message: 'Product removed from active inventory.' })
    },
    onError: (error: any) => addToast({ type: 'error', title: 'Delete failed', message: error?.response?.data?.error?.message ?? 'Unable to delete product.' })
  })

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search products by name or SKU" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3" />
          </div>
          <button onClick={() => canManage ? setOpen(true) : addToast({ type: 'info', title: 'Admin only', message: 'You need admin privileges to create products.' })} className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-white shadow hover:opacity-95">New Product</button>
        </div>
      </div>
      <ProductTable
        products={paginated}
        canManage={canManage}
        onView={(product) => setActive(product)}
        onEdit={(product) => {
          if (!canManage) return
          setEditName(product.name)
          setEditPrice(product.price)
          setEditThreshold(product.lowStockThreshold)
          setActive(product)
        }}
        onDelete={(product) => canManage ? setDeleteTarget(product) : addToast({ type: 'info', title: 'Admin only', message: 'You need admin privileges to delete products.' })}
      />
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-slate-500">Page {meta?.page ?? page} • Total {meta?.total ?? products.length} products</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Prev</button>
          <button disabled={!meta || page * (meta.limit ?? 20) >= (meta.total ?? 0)} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Next</button>
        </div>
      </div>
      <BulkImport />
      <ProductForm open={open} onClose={() => setOpen(false)} />
      <Modal title={canManage ? 'View / Edit Product' : 'View Product'} open={active !== null} onClose={() => setActive(null)}>
        {active && (
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold">SKU:</span> {active.sku}</p>
            <p><span className="font-semibold">Quantity:</span> {active.quantity}</p>
            <input disabled={!canManage} value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
            <input disabled={!canManage} type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2" />
            <input disabled={!canManage} type="number" value={editThreshold} onChange={(e) => setEditThreshold(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2" />
            {canManage && <button onClick={() => active && updateMutation.mutate({ id: active.id, payload: { name: editName, price: editPrice, lowStockThreshold: editThreshold } })} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Save Changes</button>}
          </div>
        )}
      </Modal>
      <ConfirmationDialog
        open={deleteTarget !== null}
        title="Delete product?"
        message={`This will deactivate ${deleteTarget?.name ?? 'this product'}.`}
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}

export default ProductsPage
