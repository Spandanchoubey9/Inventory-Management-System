import type { Product } from '../../types'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface ProductTableProps {
  products: Product[]
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  canManage: boolean
}

const ProductTable = ({ products, onView, onEdit, onDelete, canManage }: ProductTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3 text-sm text-slate-700">{product.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{product.sku}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{product.quantity}</td>
              <td className="px-4 py-3 text-sm text-slate-700">${product.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-slate-700">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onView(product)} className="rounded-lg border px-2 py-1 text-sky-700 hover:bg-sky-50"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => onEdit(product)} disabled={!canManage} className="rounded-lg border px-2 py-1 text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => onDelete(product)} disabled={!canManage} className="rounded-lg border px-2 py-1 text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
