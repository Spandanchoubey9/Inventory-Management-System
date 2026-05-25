import { type Request, type Response, type NextFunction } from 'express'
import { exportEntity, getExportFile, getExportJob } from './export.service.js'
import { AppError } from '../../middleware/AppError.js'

export const exportController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const entity = req.params.entity
    const allowed = ['products', 'transactions', 'suppliers', 'audit-logs']
    if (!allowed.includes(entity)) {
      throw new AppError('EXPORT_ENTITY_INVALID', 400, 'Invalid export entity')
    }
    const result = await exportEntity(entity)
    if (result.direct) {
      res.download(result.direct)
    } else if (result.job) {
      res.json({ success: true, data: { jobId: result.job.id } })
    } else {
      throw new AppError('EXPORT_FAILED', 500, 'Export failed')
    }
  } catch (error) {
    next(error)
  }
}

export const exportJobController = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const job = getExportJob(req.params.jobId)
    if (!job) {
      throw new AppError('EXPORT_JOB_NOT_FOUND', 404, 'Export job not found')
    }
    res.json({ success: true, data: job })
  } catch (error) {
    next(error)
  }
}

export const downloadExportController = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const filePath = getExportFile(req.params.jobId)
    if (!filePath) {
      throw new AppError('EXPORT_FILE_NOT_READY', 404, 'Export file not ready')
    }
    res.download(filePath)
  } catch (error) {
    next(error)
  }
}
