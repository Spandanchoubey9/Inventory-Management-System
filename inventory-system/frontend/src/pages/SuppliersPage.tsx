import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSupplier, deleteSupplier, fetchSuppliers, getSupplier, updateSupplier } from '../api/suppliers.api'
import SupplierTable from '../features/suppliers/SupplierTable'
import Modal from '../components/Modal'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { useAuthStore } from '../store/authStore'

const SuppliersPage = (): JSX.Element => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const canManage = useAuthStore((s) => s.user?.role === 'ADMIN')
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['suppliers'], queryFn: fetchSuppliers })
  const { data: active } = useQuery({ queryKey: ['supplier', activeId], queryFn: () => getSupplier(activeId ?? ''), enabled: Boolean(activeId) })
  const createMutation = useMutation(createSupplier, { onSuccess: () => { queryClient.invalidateQueries(['suppliers']); setOpen(false) } })
  const updateMutation = useMutation(updateSupplier, { onSuccess: () => { queryClient.invalidateQueries(['suppliers']); setActiveId(null) } })
  const deleteMutation = useMutation(deleteSupplier, { onSuccess: () => { queryClient.invalidateQueries(['suppliers']); setDeleteId(null) } })
  const suppliers = useMemo(() => (data ?? []).filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase())), [data, search])
  const rows = suppliers.slice((page - 1) * 8, page * 8)
  const totalPages = Math.max(1, Math.ceil(suppliers.length / 8))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">Suppliers</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search supplier" className="rounded-lg border px-3 py-2" />
          <button disabled={!canManage} onClick={() => setOpen(true)} className="rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-white disabled:opacity-50">Add Supplier</button>
        </div>
      </div>
      <SupplierTable suppliers={rows} canManage={canManage} onView={setActiveId} onEdit={setActiveId} onDelete={setDeleteId} />
      <div className="flex justify-end gap-2">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Prev</button>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Next</button>
      </div>
      <Modal title="Add Supplier" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-lg border px-3 py-2" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border px-3 py-2" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-lg border px-3 py-2" />
          <button onClick={() => createMutation.mutate({ name, email, phone })} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Save</button>
        </div>
      </Modal>
      <Modal title={canManage ? 'View / Edit Supplier' : 'View Supplier'} open={activeId !== null} onClose={() => setActiveId(null)}>
        {active && (
          <div className="space-y-3">
            <input defaultValue={active.name} onChange={(e) => setName(e.target.value)} disabled={!canManage} className="w-full rounded-lg border px-3 py-2" />
            <input defaultValue={active.email} onChange={(e) => setEmail(e.target.value)} disabled={!canManage} className="w-full rounded-lg border px-3 py-2" />
            <input defaultValue={active.phone} onChange={(e) => setPhone(e.target.value)} disabled={!canManage} className="w-full rounded-lg border px-3 py-2" />
            {canManage && <button onClick={() => updateMutation.mutate({ id: active.id, payload: { name: name || active.name, email: email || active.email, phone: phone || active.phone } })} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Update</button>}
          </div>
        )}
      </Modal>
      <ConfirmationDialog open={deleteId !== null} title="Delete supplier?" message="This action cannot be undone." onCancel={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} />
    </div>
  )
}

export default SuppliersPage
