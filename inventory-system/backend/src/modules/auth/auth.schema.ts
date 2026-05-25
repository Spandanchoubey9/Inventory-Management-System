import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(10)
})

export const googleAuthSchema = z.object({
  credential: z.string().min(1)
})
