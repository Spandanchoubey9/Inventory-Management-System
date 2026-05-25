import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../api/categories.api'
import CategoryTree from '../features/categories/CategoryTree'

const CategoriesPage = (): JSX.Element => {
  const { data } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Categories</h1>
      <CategoryTree categories={data ?? []} />
    </div>
  )
}

export default CategoriesPage
