interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal = ({ title, open, onClose, children }: ModalProps): JSX.Element | null => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-blue-950 dark:ring-1 dark:ring-blue-700/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-blue-100">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-blue-200 dark:hover:text-blue-100">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
