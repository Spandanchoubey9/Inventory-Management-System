import { type Request, type Response, type NextFunction } from 'express'
import { createSupplier, deleteSupplier, getSupplier, listSuppliers, updateSupplier } from './suppliers.service.js'

export const listSuppliersController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listSuppliers()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const createSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await createSupplier(req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getSupplier(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const updateSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await updateSupplier(req.params.id, req.body)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const deleteSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await deleteSupplier(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
