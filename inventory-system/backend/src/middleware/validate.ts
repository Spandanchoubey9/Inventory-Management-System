import type { RequestHandler } from 'express'
import type { AnyZodObject } from 'zod'
import { AppError } from './AppError.js'

export const validate = (schema: AnyZodObject, source: 'body' | 'params' | 'query' = 'body'): RequestHandler => {
  return (req, _res, next) => {
    const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query
    const result = schema.safeParse(data)

    if (!result.success) {
      return next(new AppError('VALIDATION_ERROR', 422, 'Validation failed', result.error.format()))
    }

    if (source === 'body') {
      req.body = result.data
    } else if (source === 'params') {
      req.params = result.data
    } else {
      req.query = result.data
    }

    next()
  }
}
