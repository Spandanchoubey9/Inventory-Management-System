import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/env.js'
import { logger } from './config/logger.js'
import { apiLimiter, authLimiter } from './middleware/rateLimit.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './modules/auth/auth.routes.js'
import productsRoutes from './modules/products/products.routes.js'
import categoriesRoutes from './modules/categories/categories.routes.js'
import suppliersRoutes from './modules/suppliers/suppliers.routes.js'
import transactionsRoutes from './modules/transactions/transactions.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import auditRoutes from './modules/audit/audit.routes.js'
import exportRoutes from './modules/export/export.routes.js'
import { sseRouter } from './events/sse.js'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: config.CORS_ORIGIN }))
app.use(apiLimiter)

app.use('/api/v1/auth', authLimiter, authRoutes)
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/categories', categoriesRoutes)
app.use('/api/v1/suppliers', suppliersRoutes)
app.use('/api/v1/transactions', transactionsRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/audit-logs', auditRoutes)
app.use('/api/v1/export', exportRoutes)
app.use('/api/v1/events', sseRouter)

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.use(errorHandler)

;(app as unknown as import('events').EventEmitter).on('error', (error: unknown) => {
  logger.error({ error }, 'Express app error')
})

export { app }
