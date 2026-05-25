import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { createProductController, bulkImportController, deleteProductController, getProductController, getProductTransactionsController, listProductsController, updateProductController, uploadFile } from './products.controller.js'
import { createProductSchema, updateProductSchema } from './products.schema.js'

const router = Router()

router.get('/', authenticate, listProductsController)
router.post('/', authenticate, requireRole('ADMIN'), validate(createProductSchema), createProductController)
router.get('/:id', authenticate, getProductController)
router.patch('/:id', authenticate, requireRole('ADMIN'), validate(updateProductSchema), updateProductController)
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteProductController)
router.post('/bulk-import', authenticate, requireRole('ADMIN'), uploadFile, bulkImportController)
router.get('/:id/transactions', authenticate, getProductTransactionsController)

export default router
