import { z } from 'zod'

export const auditQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional()
})
