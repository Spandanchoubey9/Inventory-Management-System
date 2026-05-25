import { type Request, type Response, type NextFunction } from 'express'
import { createTransaction, getTransactionById, listTransactions } from './transactions.service.js'

export const listTransactionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 20)
    const data = await listTransactions(page, limit)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const createTransactionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth = (req as unknown as { user?: { id: string } }).user
    if (!auth) {
      throw new Error('Authentication required')
    }
    const transaction = await createTransaction({
      productId: req.body.productId,
      type: req.body.type,
      quantity: req.body.quantity,
      note: req.body.note,
      createdById: auth.id,
      ipAddress: req.ip ?? ''
    })
    res.status(201).json({ success: true, data: transaction })
  } catch (error) {
    next(error)
  }
}

export const getTransactionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getTransactionById(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
