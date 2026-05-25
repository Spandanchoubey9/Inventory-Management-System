import { prisma } from '../../config/db.js'
import { AppError } from '../../middleware/AppError.js'

export const listProducts = async (page = 1, limit = 20, search = ''): Promise<unknown> => {
  const where = {
    deletedAt: null as null,
    AND: search ? [{ name: { contains: search, mode: 'insensitive' } }] : undefined
  }

  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  })

  const total = await prisma.product.count({ where })

  return { data: products, meta: { page, limit, total } }
}

export const getProductById = async (id: string): Promise<unknown> => {
  const product = await prisma.product.findUnique({ where: { id }, include: { suppliers: { include: { supplier: true } }, transactions: true } })
  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 404, 'Product not found')
  }
  return product
}

export const createProduct = async (data: { name: string; sku: string; description?: string; categoryId: string; price: number; lowStockThreshold?: number; imageUrl?: string; supplierIds?: string[] }): Promise<unknown> => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      lowStockThreshold: data.lowStockThreshold ?? 10,
      imageUrl: data.imageUrl
    }
  })

  if (data.supplierIds?.length) {
    await prisma.productSupplier.createMany({
      data: data.supplierIds.map((supplierId) => ({ productId: product.id, supplierId, isPrimary: false }))
    })
  }

  return product
}

export const updateProduct = async (id: string, data: { name?: string; description?: string; categoryId?: string; price?: number; lowStockThreshold?: number; imageUrl?: string; isActive?: boolean; supplierIds?: string[] }): Promise<unknown> => {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError('PRODUCT_NOT_FOUND', 404, 'Product not found')
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      lowStockThreshold: data.lowStockThreshold,
      imageUrl: data.imageUrl,
      isActive: data.isActive
    }
  })

  if (data.supplierIds) {
    await prisma.productSupplier.deleteMany({ where: { productId: id } })
    await prisma.productSupplier.createMany({ data: data.supplierIds.map((supplierId) => ({ productId: id, supplierId, isPrimary: false })) })
  }
  return product
}

export const softDeleteProduct = async (id: string): Promise<unknown> => {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError('PRODUCT_NOT_FOUND', 404, 'Product not found')
  }
  return prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
}

export const getProductTransactions = async (id: string): Promise<unknown> => {
  await getProductById(id)
  return prisma.transaction.findMany({ where: { productId: id }, orderBy: { createdAt: 'desc' } })
}
