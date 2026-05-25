import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRY: z.string().min(1),
  JWT_REFRESH_EXPIRY: z.string().min(1),
  BCRYPT_ROUNDS: z.string().regex(/^[0-9]+$/).transform(Number),
  PORT: z.string().regex(/^[0-9]+$/).transform(Number),
  NODE_ENV: z.string(),
  LOG_LEVEL: z.string().default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  GOOGLE_CLIENT_ID: z.string().min(1).optional()
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

export const config = parsed.data
