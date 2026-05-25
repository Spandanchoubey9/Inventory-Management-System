import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { prisma } from '../../config/db.js'
import { createTransaction } from './transactions.service.js'

let testUserId = ''
let testProductId = ''

beforeAll(async () => {
  const existingUser = await prisma.user.findUnique({ where: { email: 'transuser@inventory.com' } })
  if (existingUser) {
    await prisma.auditLog.deleteMany({ where: { actorId: existingUser.id } })
  }

  await prisma.notification.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.product.deleteMany({ where: { sku: 'TEST-PROD-1' } })
  await prisma.user.deleteMany({ where: { email: 'transuser@inventory.com' } })
  const user = await prisma.user.create({ data: { name: 'Trans User', email: 'transuser@inventory.com', passwordHash: 'hash', role: 'STAFF' } })
  testUserId = user.id
  const category = await prisma.category.findFirst() ?? await prisma.category.create({ data: { name: 'Default', slug: 'default' } })
  const product = await prisma.product.create({ data: { name: 'Stock Product', sku: 'TEST-PROD-1', categoryId: category.id, price: 10.0, lowStockThreshold: 5 } })
  testProductId = product.id
})

afterAll(async () => {
  await prisma.transaction.deleteMany({ where: { createdById: testUserId } })
  await prisma.notification.deleteMany({ where: { entityId: testProductId } })
  await prisma.auditLog.deleteMany({ where: { actorId: testUserId } })
  await prisma.product.deleteMany({ where: { id: testProductId } })
  await prisma.user.deleteMany({ where: { id: testUserId } })
  await prisma.$disconnect()
})

describe('transactions.service', () => {
  test('STOCK_IN increases product quantity correctly', async () => {
    const transaction = await createTransaction({ productId: testProductId, type: 'STOCK_IN', quantity: 10, createdById: testUserId, ipAddress: '127.0.0.1' })
    const product = await prisma.product.findUnique({ where: { id: testProductId } })
    expect(product?.quantity).toBe(10)
    expect(transaction).toHaveProperty('id')
  })

  test('STOCK_OUT with sufficient stock succeeds and decreases quantity', async () => {
    const transaction = await createTransaction({ productId: testProductId, type: 'STOCK_OUT', quantity: 4, createdById: testUserId, ipAddress: '127.0.0.1' })
    const product = await prisma.product.findUnique({ where: { id: testProductId } })
    expect(product?.quantity).toBe(6)
    expect(transaction).toHaveProperty('id')
  })

  test('STOCK_OUT with insufficient stock throws STOCK_INSUFFICIENT', async () => {
    await expect(createTransaction({ productId: testProductId, type: 'STOCK_OUT', quantity: 100, createdById: testUserId, ipAddress: '127.0.0.1' })).rejects.toMatchObject({ code: 'STOCK_INSUFFICIENT' })
  })

  test('STOCK_OUT below threshold creates Notification row', async () => {
    const product = await prisma.product.update({ where: { id: testProductId }, data: { quantity: 5, lowStockThreshold: 7 } })
    await createTransaction({ productId: testProductId, type: 'STOCK_OUT', quantity: 3, createdById: testUserId, ipAddress: '127.0.0.1' })
    const notification = await prisma.notification.findFirst({ where: { entityId: product.id, type: 'LOW_STOCK' } })
    expect(notification).toBeTruthy()
  })
})
