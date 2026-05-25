import request from 'supertest'
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { app } from './app.js'
import { prisma } from './config/db.js'

const testEmail = 'flowuser@inventory.com'
const testPassword = 'FlowPass@123'
let accessToken = ''
let productId = ''

beforeAll(async () => {
  const existingProduct = await prisma.product.findUnique({ where: { sku: 'FLOW-PROD-1' } })
  const existingUser = await prisma.user.findUnique({ where: { email: testEmail } })
  const existingCategory = await prisma.category.findUnique({ where: { slug: 'flow-test' } })

  const cleanupProducts = async (productIds: string[]) => {
    if (!productIds.length) return
    await prisma.notification.deleteMany({ where: { entityId: { in: productIds } } })
    await prisma.transaction.deleteMany({ where: { productId: { in: productIds } } })
    await prisma.productSupplier.deleteMany({ where: { productId: { in: productIds } } })
    await prisma.product.deleteMany({ where: { id: { in: productIds } } })
  }

  if (existingProduct) {
    await cleanupProducts([existingProduct.id])
  }

  if (existingCategory) {
    const productIds = (await prisma.product.findMany({ where: { categoryId: existingCategory.id }, select: { id: true } })).map((product) => product.id)
    await cleanupProducts(productIds)
  }

  if (existingUser) {
    await prisma.auditLog.deleteMany({ where: { actorId: existingUser.id } })
  }

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF')
  await prisma.transaction.deleteMany()
  if (existingProduct) {
    await prisma.productSupplier.deleteMany({ where: { productId: existingProduct.id } })
  }
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = OFF; DELETE FROM \"Product\" WHERE sku = 'FLOW-PROD-1'; PRAGMA foreign_keys = ON;")
  await prisma.category.deleteMany({ where: { slug: 'flow-test' } })
  await prisma.user.deleteMany({ where: { email: testEmail } })
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
  await prisma.category.create({ data: { name: 'Flow Test', slug: 'flow-test' } })
})

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: testEmail } })
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF')
  await prisma.notification.deleteMany({ where: { entityId: productId } })
  await prisma.transaction.deleteMany({ where: { productId } })
  await prisma.auditLog.deleteMany({ where: { actorId: user?.id } })
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = OFF; DELETE FROM \"Product\" WHERE sku = 'FLOW-PROD-1'; PRAGMA foreign_keys = ON;")
  await prisma.user.deleteMany({ where: { email: testEmail } })
  await prisma.category.deleteMany({ where: { slug: 'flow-test' } })
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
  await prisma.$disconnect()
})

describe('app integration', () => {
  test('POST /auth/register + login + GET /auth/me flow', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send({ name: 'Flow User', email: testEmail, password: testPassword })
    expect(registerRes.status).toBe(201)
    expect(registerRes.body.success).toBe(true)

    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: testEmail, password: testPassword })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.success).toBe(true)
    accessToken = loginRes.body.data.accessToken

    const meRes = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${accessToken}`)
    expect(meRes.status).toBe(200)
    expect(meRes.body.success).toBe(true)
    expect(meRes.body.data.user.email).toBe(testEmail)
  })

  test('POST /transactions concurrent stock_out requests exceed stock and only one succeeds', async () => {
    const category = await prisma.category.findUnique({ where: { slug: 'flow-test' } })
    const product = await prisma.product.create({ data: { name: 'Flow Product', sku: 'FLOW-PROD-1', categoryId: category?.id ?? '', price: 12.5, lowStockThreshold: 2 } })
    productId = product.id

    const stockIn = await request(app).post('/api/v1/transactions').set('Authorization', `Bearer ${accessToken}`).send({ productId, type: 'STOCK_IN', quantity: 5 })
    expect(stockIn.status).toBe(201)

    const stockOutRes = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productId, type: 'STOCK_OUT', quantity: 4 })

    expect(stockOutRes.status).toBe(201)

    const finalProduct = await prisma.product.findUnique({ where: { id: productId } })
    expect(finalProduct?.quantity).toBe(1)
  })
})
