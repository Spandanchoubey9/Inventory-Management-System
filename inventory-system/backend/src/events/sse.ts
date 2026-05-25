import type { Router } from 'express'
import { Router as createRouter } from 'express'
import { prisma } from '../config/db.js'
import { authenticate, type AuthRequest } from '../middleware/auth.js'

const clients = new Map<string, import('http').ServerResponse>()

const sendEvent = (id: string, data: unknown): void => {
  const client = clients.get(id)

  if (!client) {
    return
  }

  client.write(`event: notification\ndata: ${JSON.stringify(data)}\n\n`)
}

export const notifyAdmins = async (payload: unknown): Promise<void> => {
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN', isActive: true }, select: { id: true } })

  for (const admin of admins) {
    sendEvent(admin.id, payload)
  }
}

export const sseRouter: Router = createRouter()

sseRouter.get('/notifications', authenticate, (req, res) => {
  const authReq = req as unknown as AuthRequest

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  })

  res.write('retry: 10000\n\n')

  if (authReq.user) {
    clients.set(authReq.user.id, res)
  }

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n')
  }, 30000)

  req.on('close', () => {
    clearInterval(heartbeat)
    if (authReq.user) {
      clients.delete(authReq.user.id)
    }
  })
})
