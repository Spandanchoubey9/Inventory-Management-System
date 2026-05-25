import { type Request, type Response, type NextFunction } from 'express'
import { prisma } from '../../config/db.js'
import { AppError } from '../../middleware/AppError.js'

export const listAuditController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 20)

    if (page < 1 || limit < 1) {
      throw new AppError('VALIDATION_ERROR', 422, 'Page and limit must be positive')
    }

    const data = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.auditLog.count()

    res.json({ success: true, data, meta: { page, limit, total } })
  } catch (error) {
    next(error)
  }
}
