import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { createSupplierController, deleteSupplierController, getSupplierController, listSuppliersController, updateSupplierController } from './suppliers.controller.js'
import { createSupplierSchema, updateSupplierSchema } from './suppliers.schema.js'

const router = Router()

router.get('/', authenticate, listSuppliersController)
router.post('/', authenticate, requireRole('ADMIN'), validate(createSupplierSchema), createSupplierController)
router.get('/:id', authenticate, getSupplierController)
router.patch('/:id', authenticate, requireRole('ADMIN'), validate(updateSupplierSchema), updateSupplierController)
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteSupplierController)

export default router
