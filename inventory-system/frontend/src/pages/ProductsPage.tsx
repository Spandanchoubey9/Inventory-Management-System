import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products.api'
import ProductTable from '../features/products/ProductTable'
import ProductForm from '../features/products/ProductForm'
import BulkImport from '../features/products/BulkImport'

const ProductsPage = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const { data } = useQuery({ queryKey: ['products', { page, search }], queryFn: fetchProducts })

  const products = useMemo(() => data?.data ?? [], [data])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="rounded-lg border px-3 py-2" />
        <button onClick={() => setOpen(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-white">New Product</button>
      </div>
      <ProductTable products={products} />
      <BulkImport />
      <ProductForm open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default ProductsPage
