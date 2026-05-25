import { X } from 'lucide-react'
import { useToastStore } from '../store/toastStore'

const Toast = (): JSX.Element => {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-80 overflow-hidden rounded-3xl border p-4 shadow-xl transition duration-200 ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : toast.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-slate-200 bg-white text-slate-900'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{toast.title}</div>
              <p className="mt-1 text-sm leading-6 text-slate-700">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toast
