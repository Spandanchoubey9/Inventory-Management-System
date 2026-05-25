import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { prisma } from '../config/db.js'
import { AppError } from './AppError.js'

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string; name: string }
}

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization ?? (typeof req.query.token === 'string' ? `Bearer ${req.query.token}` : undefined)

    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError('AUTH_UNAUTHORIZED', 401, 'Authorization header missing')
    }

    const token = authorization.split(' ')[1]

    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as { sub: string; role: string }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })

    if (!user || !user.isActive) {
      throw new AppError('AUTH_UNAUTHORIZED', 401, 'Invalid user')
    }

    ;(req as unknown as AuthRequest).user = { id: user.id, role: user.role, email: user.email, name: user.name }
    next()
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('AUTH_UNAUTHORIZED', 401, 'Invalid token'))
  }
}
