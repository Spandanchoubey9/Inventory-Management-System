interface CategoryTreeProps {
  categories: Array<{ id: string; name: string }>
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  canManage: boolean
}

const CategoryTree = ({ categories, onView, onEdit, onDelete, canManage }: CategoryTreeProps): JSX.Element => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-blue-950/70">
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-blue-800/70 dark:bg-blue-900/40">
            <span className="text-slate-800 dark:text-blue-100">{category.name}</span>
            <div className="flex gap-2">
              <button onClick={() => onView(category.id)} className="rounded-lg border px-3 py-1 text-sm text-sky-700 dark:border-blue-700 dark:text-blue-300">View</button>
              <button disabled={!canManage} onClick={() => onEdit(category.id)} className="rounded-lg border px-3 py-1 text-sm text-amber-700 disabled:opacity-50 dark:border-blue-700 dark:text-amber-300">Edit</button>
              <button disabled={!canManage} onClick={() => onDelete(category.id)} className="rounded-lg border px-3 py-1 text-sm text-rose-700 disabled:opacity-50 dark:border-blue-700 dark:text-rose-300">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryTree
