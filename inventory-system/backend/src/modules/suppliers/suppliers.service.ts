import { prisma } from '../../config/db.js'
import { AppError } from '../../middleware/AppError.js'

export const listSuppliers = async (): Promise<unknown> => {
  return prisma.supplier.findMany({ where: { deletedAt: null } })
}

export const createSupplier = async (data: { name: string; email?: string; phone?: string; address?: string }): Promise<unknown> => {
  return prisma.supplier.create({ data })
}

export const getSupplier = async (id: string): Promise<unknown> => {
  const supplier = await prisma.supplier.findUnique({ where: { id } })
  if (!supplier) {
    throw new AppError('SUPPLIER_NOT_FOUND', 404, 'Supplier not found')
  }
  return supplier
}

export const updateSupplier = async (id: string, data: { name?: string; email?: string; phone?: string; address?: string }): Promise<unknown> => {
  await getSupplier(id)
  return prisma.supplier.update({ where: { id }, data })
}

export const deleteSupplier = async (id: string): Promise<unknown> => {
  await getSupplier(id)
  return prisma.supplier.update({ where: { id }, data: { deletedAt: new Date() } })
}
