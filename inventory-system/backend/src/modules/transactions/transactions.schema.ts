import { z } from 'zod'

export const createTransactionSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'RETURN']),
  quantity: z.number().int().positive(),
  note: z.string().optional()
})
