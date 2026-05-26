import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../api/categories.api'
import CategoryTree from '../features/categories/CategoryTree'
import Modal from '../components/Modal'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { useAuthStore } from '../store/authStore'

const CategoriesPage = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const canManage = useAuthStore((s) => s.user?.role === 'ADMIN')
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const createMutation = useMutation(createCategory, { onSuccess: () => { queryClient.invalidateQueries(['categories']); setOpen(false); setName('') } })
  const updateMutation = useMutation(updateCategory, { onSuccess: () => { queryClient.invalidateQueries(['categories']); setActiveId(null) } })
  const deleteMutation = useMutation(deleteCategory, { onSuccess: () => { queryClient.invalidateQueries(['categories']); setDeleteId(null) } })
  const categories = useMemo(() => (data ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase())), [data, search])
  const active = categories.find((c) => c.id === activeId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-800/70 dark:bg-blue-950/70">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-blue-100">Categories</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search category" className="rounded-lg border px-3 py-2 dark:border-blue-700 dark:bg-blue-900/60" />
          <button disabled={!canManage} onClick={() => setOpen(true)} className="rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-white disabled:opacity-50">Add Category</button>
        </div>
      </div>
      <CategoryTree categories={categories} canManage={canManage} onView={setActiveId} onEdit={setActiveId} onDelete={setDeleteId} />
      <Modal title="Add Category" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="w-full rounded-lg border px-3 py-2" />
          <button onClick={() => createMutation.mutate({ name })} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Save</button>
        </div>
      </Modal>
      <Modal title={canManage ? 'View / Edit Category' : 'View Category'} open={activeId !== null} onClose={() => setActiveId(null)}>
        {active && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-blue-200">Category ID: {active.id}</p>
            <input defaultValue={active.name} onChange={(e) => setName(e.target.value)} disabled={!canManage} className="w-full rounded-lg border px-3 py-2" />
            {canManage && <button onClick={() => updateMutation.mutate({ id: active.id, payload: { name: name || active.name } })} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Update</button>}
          </div>
        )}
      </Modal>
      <ConfirmationDialog open={deleteId !== null} title="Delete category?" message="Products under this category may be affected." onCancel={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} />
    </div>
  )
}

export default CategoriesPage
