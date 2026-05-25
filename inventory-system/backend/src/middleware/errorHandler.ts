import { type ErrorRequestHandler } from 'express'
import { logger } from '../config/logger.js'
import { AppError } from './AppError.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error')

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    })
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  })
}

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection')
  process.exit(1)
})
