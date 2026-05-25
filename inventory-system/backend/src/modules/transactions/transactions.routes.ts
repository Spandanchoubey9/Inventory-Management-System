import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { createTransactionController, getTransactionController, listTransactionsController } from './transactions.controller.js'
import { createTransactionSchema } from './transactions.schema.js'

const router = Router()

router.get('/', authenticate, listTransactionsController)
router.post('/', authenticate, validate(createTransactionSchema), createTransactionController)
router.get('/:id', authenticate, getTransactionController)

export default router
