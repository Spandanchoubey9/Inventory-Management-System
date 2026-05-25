import { prisma } from '../../config/db.js'
import { AppError } from '../../middleware/AppError.js'
import { notifyAdmins } from '../../events/sse.js'

export const listTransactions = async (page = 1, limit = 20): Promise<unknown> => {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: { product: true, createdBy: true }
  })
  const total = await prisma.transaction.count()
  return { data: transactions, meta: { page, limit, total } }
}

export const getTransactionById = async (id: string): Promise<unknown> => {
  const transaction = await prisma.transaction.findUnique({ where: { id }, include: { product: true, createdBy: true } })
  if (!transaction) {
    throw new AppError('TRANSACTION_NOT_FOUND', 404, 'Transaction not found')
  }
  return transaction
}

export const createTransaction = async (payload: { productId: string; type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'RETURN'; quantity: number; note?: string; createdById: string; ipAddress: string }): Promise<unknown> => {
  let shouldNotify = false
  let productName = ''
  let updatedQuantity = 0

  const transaction = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: payload.productId } })
    if (!product) {
      throw new AppError('PRODUCT_NOT_FOUND', 404, 'Product not found')
    }

    let newQuantity = product.quantity

    if (payload.type === 'STOCK_IN' || payload.type === 'RETURN') {
      newQuantity += payload.quantity
    } else if (payload.type === 'STOCK_OUT') {
      if (product.quantity - payload.quantity < 0) {
        throw new AppError('STOCK_INSUFFICIENT', 409, 'Insufficient stock')
      }
      newQuantity -= payload.quantity
    } else if (payload.type === 'ADJUSTMENT') {
      newQuantity += payload.quantity
    }

    productName = product.name
    updatedQuantity = newQuantity
    shouldNotify = newQuantity < product.lowStockThreshold

    const transaction = await tx.transaction.create({
      data: {
        productId: payload.productId,
        type: payload.type,
        quantity: payload.quantity,
        note: payload.note,
        createdById: payload.createdById
      }
    })

    await tx.product.update({ where: { id: payload.productId }, data: { quantity: newQuantity } })

    await tx.auditLog.create({
      data: {
        action: 'TRANSACTION_CREATED',
        entityType: 'Transaction',
        entityId: transaction.id,
        actorId: payload.createdById,
        oldValue: JSON.stringify({ quantity: product.quantity }),
        newValue: JSON.stringify({ quantity: newQuantity }),
        ipAddress: payload.ipAddress
      }
    })

    if (shouldNotify) {
      await tx.notification.create({
        data: {
          userId: null,
          type: 'LOW_STOCK',
          message: `Product ${product.name} is below low stock threshold`,
          entityId: product.id
        }
      })
    }

    return transaction
  }, { isolationLevel: 'Serializable' })

  if (shouldNotify) {
    await notifyAdmins({ type: 'LOW_STOCK', productId: payload.productId, currentQuantity: updatedQuantity, productName })
  }

  return transaction
}
