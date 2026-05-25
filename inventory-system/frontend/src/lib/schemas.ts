import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

export const transactionSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'RETURN']),
  quantity: z.number().int().min(1),
  note: z.string().optional()
})

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  price: z.number().positive(),
  lowStockThreshold: z.number().int().min(0),
  imageUrl: z.string().url().or(z.literal('')).optional().transform((value) => (value === '' ? undefined : value))
})
