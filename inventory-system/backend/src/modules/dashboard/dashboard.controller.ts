import { type Request, type Response, type NextFunction } from 'express'
import { getDashboardAnalytics, getDashboardSummary, listNotifications, markNotificationRead } from './dashboard.service.js'

export const summaryController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getDashboardSummary()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const analyticsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const window = String(req.query.window ?? '7d') as '7d' | '30d' | '90d'
    const data = await getDashboardAnalytics(window)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const notificationsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as unknown as { user: { id: string } }).user.id
    const data = await listNotifications(userId)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const markReadController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as unknown as { user: { id: string } }).user.id
    const result = await markNotificationRead(req.params.id, userId)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
