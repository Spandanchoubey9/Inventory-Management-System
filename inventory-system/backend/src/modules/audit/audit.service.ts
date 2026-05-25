import { prisma } from '../../config/db.js'

export const logAudit = async (payload: {
  action: string
  entityType: string
  entityId: string
  actorId: string
  oldValue?: unknown
  newValue?: unknown
  ipAddress: string
}): Promise<void> => {
  await prisma.auditLog.create({
    data: {
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      actorId: payload.actorId,
      oldValue: payload.oldValue ? JSON.stringify(payload.oldValue) : null,
      newValue: payload.newValue ? JSON.stringify(payload.newValue) : null,
      ipAddress: payload.ipAddress
    }
  })
}
