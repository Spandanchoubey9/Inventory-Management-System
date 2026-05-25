import { useQuery } from '@tanstack/react-query'
import { fetchSuppliers } from '../api/suppliers.api'
import SupplierTable from '../features/suppliers/SupplierTable'

const SuppliersPage = (): JSX.Element => {
  const { data } = useQuery({ queryKey: ['suppliers'], queryFn: fetchSuppliers })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Suppliers</h1>
      <SupplierTable suppliers={data ?? []} />
    </div>
  )
}

export default SuppliersPage
