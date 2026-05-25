import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { loginController, logoutController, meController, refreshController, registerController, googleAuthController } from './auth.controller.js'
import { loginSchema, refreshSchema, registerSchema, googleAuthSchema } from './auth.schema.js'

const router = Router()

router.post('/register', validate(registerSchema), registerController)
router.post('/login', validate(loginSchema), loginController)
router.post('/google', validate(googleAuthSchema), googleAuthController)
router.post('/refresh', validate(refreshSchema), refreshController)
router.post('/logout', validate(refreshSchema), logoutController)
router.get('/me', authenticate, meController)

export default router
