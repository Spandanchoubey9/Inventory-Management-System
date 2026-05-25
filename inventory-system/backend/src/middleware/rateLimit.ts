import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
})

export const apiLimiter = rateLimit({
  windowMs: 60000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
})

export const exportLimiter = rateLimit({
  windowMs: 3600000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false
})
