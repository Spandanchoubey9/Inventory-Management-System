import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  price: z.number().positive(),
  lowStockThreshold: z.number().int().nonnegative().default(10),
  imageUrl: z.string().url().or(z.literal('')).optional().transform((value) => (value === '' ? undefined : value)),
  supplierIds: z.array(z.string().uuid()).optional()
})

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  price: z.number().positive().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().or(z.literal('')).optional().transform((value) => (value === '' ? undefined : value)),
  isActive: z.boolean().optional(),
  supplierIds: z.array(z.string().uuid()).optional()
})
