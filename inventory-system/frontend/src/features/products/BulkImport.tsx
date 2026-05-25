import { useState } from 'react'
import api from '../../api/axios'

const BulkImport = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const handleSubmit = async (): Promise<void> => {
    if (!file) {
      setMessage('Select a CSV file first')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/v1/products/bulk-import', formData)
    setMessage(`Imported ${response.data.data.results.length} rows`)
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-3 text-lg font-semibold">Bulk import</div>
      <input type="file" accept=".csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mb-3" />
      <button onClick={handleSubmit} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Upload CSV</button>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  )
}

export default BulkImport
