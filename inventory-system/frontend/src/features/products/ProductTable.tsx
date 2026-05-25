import type { Product } from '../../types'

interface ProductTableProps {
  products: Product[]
}

const ProductTable = ({ products }: ProductTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3 text-sm text-slate-700">{product.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{product.sku}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{product.quantity}</td>
              <td className="px-4 py-3 text-sm text-slate-700">${product.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
