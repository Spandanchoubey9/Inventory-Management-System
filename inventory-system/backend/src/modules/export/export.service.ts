import fs from 'fs'
import path from 'path'
import PQueue from 'p-queue'
import { stringify } from 'csv-stringify'
import { prisma } from '../../config/db.js'

const exportsDir = path.resolve(process.cwd(), 'backend', 'exports')
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true })
}

const queue = new PQueue({ concurrency: 1 })

interface ExportJob {
  id: string
  status: 'pending' | 'completed' | 'failed'
  entity: string
  filePath?: string
  error?: string
}

const jobs = new Map<string, ExportJob>()

const createCsvFile = async (entity: string, rows: unknown[]): Promise<string> => {
  const filename = `${entity}-${Date.now()}.csv`
  const destination = path.join(exportsDir, filename)
  const columns = Object.keys(rows[0] ?? {})
  const writable = fs.createWriteStream(destination)

  return new Promise((resolve, reject) => {
    const stringifier = stringify({ header: true, columns })
    stringifier.pipe(writable)
    for (const row of rows) {
      stringifier.write(row)
    }
    stringifier.end()
    writable.on('finish', () => resolve(destination))
    writable.on('error', reject)
  })
}

export const exportEntity = async (entity: string): Promise<{ direct?: string; job?: ExportJob }> => {
  const rows = await getRows(entity)
  if (rows.length < 10000) {
    const filePath = await createCsvFile(entity, rows)
    return { direct: filePath }
  }

  const jobId = `${entity}-${Date.now()}`
  const job: ExportJob = { id: jobId, status: 'pending', entity }
  jobs.set(jobId, job)

  queue.add(async () => {
    try {
      job.filePath = await createCsvFile(entity, rows)
      job.status = 'completed'
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'Unknown error'
    }
  })

  return { job }
}

const getRows = async (entity: string): Promise<unknown[]> => {
  switch (entity) {
    case 'products':
      return prisma.product.findMany({ where: { deletedAt: null }, include: { category: true } })
    case 'transactions':
      return prisma.transaction.findMany({ include: { product: true, createdBy: true } })
    case 'suppliers':
      return prisma.supplier.findMany({ where: { deletedAt: null } })
    case 'audit-logs':
      return prisma.auditLog.findMany()
    default:
      return []
  }
}

export const getExportJob = (id: string): ExportJob | undefined => jobs.get(id)

export const getExportFile = (jobId: string): string | undefined => jobs.get(jobId)?.filePath
