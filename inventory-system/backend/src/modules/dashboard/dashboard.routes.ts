import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { analyticsController, markReadController, notificationsController, summaryController } from './dashboard.controller.js'
import { z } from 'zod'

const router = Router()

const analyticsQuery = z.object({ window: z.enum(['7d', '30d', '90d']).default('7d') })

router.get('/summary', authenticate, summaryController)
router.get('/analytics', authenticate, validate(analyticsQuery, 'query'), analyticsController)
router.get('/notifications', authenticate, notificationsController)
router.patch('/notifications/:id/read', authenticate, markReadController)

export default router
