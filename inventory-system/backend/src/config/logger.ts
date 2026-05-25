import pino from 'pino'
import { config } from './env.js'

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers
      }
    },
    res(res) {
      return {
        statusCode: res.statusCode
      }
    }
  }
})
