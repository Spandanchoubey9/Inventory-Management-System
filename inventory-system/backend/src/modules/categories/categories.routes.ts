import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { createCategoryController, deleteCategoryController, listCategoriesController, updateCategoryController } from './categories.controller.js'
import { createCategorySchema, updateCategorySchema } from './categories.schema.js'

const router = Router()

router.get('/', authenticate, listCategoriesController)
router.post('/', authenticate, requireRole('ADMIN'), validate(createCategorySchema), createCategoryController)
router.patch('/:id', authenticate, requireRole('ADMIN'), validate(updateCategorySchema), updateCategoryController)
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteCategoryController)

export default router
