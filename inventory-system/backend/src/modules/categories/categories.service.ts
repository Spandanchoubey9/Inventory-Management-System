import { prisma } from '../../config/db.js'
import { AppError } from '../../middleware/AppError.js'

export const listCategories = async (): Promise<unknown> => {
  return prisma.category.findMany({ where: { deletedAt: null }, include: { children: true } })
}

export const createCategory = async (data: { name: string; slug: string; parentId?: string | null }): Promise<unknown> => {
  return prisma.category.create({ data })
}

export const updateCategory = async (id: string, data: { name?: string; slug?: string; parentId?: string | null }): Promise<unknown> => {
  const existing = await prisma.category.findUnique({ where: { id } })

  if (!existing) {
    throw new AppError('CATEGORY_NOT_FOUND', 404, 'Category not found')
  }

  return prisma.category.update({ where: { id }, data })
}

export const deleteCategory = async (id: string): Promise<unknown> => {
  const existing = await prisma.category.findUnique({ where: { id } })

  if (!existing) {
    throw new AppError('CATEGORY_NOT_FOUND', 404, 'Category not found')
  }

  return prisma.category.update({ where: { id }, data: { deletedAt: new Date() } })
}
