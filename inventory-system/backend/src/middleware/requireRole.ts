import type { RequestHandler } from 'express'
import { AppError } from './AppError.js'
import type { AuthRequest } from './auth.js'

export const requireRole = (role: 'ADMIN' | 'STAFF'): RequestHandler => {
  return (req, _res, next) => {
    const authReq = req as unknown as AuthRequest

    if (!authReq.user) {
      return next(new AppError('AUTH_UNAUTHORIZED', 401, 'Authentication required'))
    }

    if (authReq.user.role !== role && authReq.user.role !== 'ADMIN') {
      return next(new AppError('AUTH_FORBIDDEN', 403, 'Insufficient privileges'))
    }

    next()
  }
}
