interface CategoryTreeProps {
  categories: Array<{ id: string; name: string }>
}

const CategoryTree = ({ categories }: CategoryTreeProps): JSX.Element => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="rounded-xl border border-slate-200 p-3">
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryTree
