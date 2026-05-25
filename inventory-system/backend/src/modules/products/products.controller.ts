import { type Request, type Response, type NextFunction } from 'express'
import multer from 'multer'
import { parse } from 'csv-parse'
import { prisma } from '../../config/db.js'
import { AppError } from '../../middleware/AppError.js'
import { createProduct, getProductById, getProductTransactions, listProducts, softDeleteProduct, updateProduct } from './products.service.js'

const upload = multer({ storage: multer.memoryStorage() })

export const uploadFile = upload.single('file')

export const listProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 20)
    const search = String(req.query.search ?? '')
    const data = await listProducts(page, limit, search)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const createProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await createProduct(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const getProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await getProductById(req.params.id)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const updateProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await updateProduct(req.params.id, req.body)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await softDeleteProduct(req.params.id)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const bulkImportController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('FILE_REQUIRED', 400, 'CSV file is required')
    }

    const records: Array<Record<string, string>> = []
    const parser = parse(req.file.buffer.toString(), { columns: true, skip_empty_lines: true, trim: true })

    for await (const record of parser) {
      records.push(record as Record<string, string>)
    }

    const results = [] as Array<{ row: number; success: boolean; message: string }>

    for (const [index, row] of records.entries()) {
      try {
        const category = await prisma.category.findUnique({ where: { slug: row.categorySlug } })
        if (!category) {
          throw new AppError('CATEGORY_NOT_FOUND', 404, `Category slug ${row.categorySlug} not found`)
        }

        await createProduct({
          name: row.name,
          sku: row.sku,
          description: row.description || undefined,
          categoryId: category.id,
          price: Number(row.price),
          lowStockThreshold: Number(row.lowStockThreshold) || 10,
          imageUrl: row.imageUrl || undefined
        })

        results.push({ row: index + 1, success: true, message: 'Imported' })
      } catch (error) {
        results.push({ row: index + 1, success: false, message: error instanceof Error ? error.message : 'Failed' })
      }
    }

    res.json({ success: true, data: { results } })
  } catch (error) {
    next(error)
  }
}

export const getProductTransactionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getProductTransactions(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
