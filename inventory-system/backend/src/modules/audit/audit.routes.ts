import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { auditQuerySchema } from './audit.schema.js'
import { listAuditController } from './audit.controller.js'

const router = Router()

router.get('/', authenticate, requireRole('ADMIN'), validate(auditQuerySchema, 'query'), listAuditController)

export default router
