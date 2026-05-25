import Modal from './Modal'

interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmationDialogProps): JSX.Element => {
  if (!open) {
    return <></>
  }

  return (
    <Modal title={title} open={open} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-slate-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700">
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationDialog
