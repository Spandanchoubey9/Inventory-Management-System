import { type Request, type Response, type NextFunction } from 'express'
import { createCategory, deleteCategory, listCategories, updateCategory } from './categories.service.js'

export const listCategoriesController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listCategories()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const createCategoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await createCategory(req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await updateCategory(req.params.id, req.body)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await deleteCategory(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
