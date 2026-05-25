import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { exportController, exportJobController, downloadExportController } from './export.controller.js'

const router = Router()

router.get('/jobs/:jobId', authenticate, exportJobController)
router.get('/download/:jobId', authenticate, downloadExportController)
router.get('/:entity', authenticate, exportController)

export default router
