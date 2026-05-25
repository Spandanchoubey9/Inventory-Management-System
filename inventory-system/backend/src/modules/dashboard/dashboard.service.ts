import { prisma } from '../../config/db.js'
import { getOrSet, deleteCacheKey } from '../../config/cache.js'

export const getDashboardSummary = async (): Promise<unknown> => {
  return getOrSet('dashboard:summary', 60, async () => {
    const totalProducts = await prisma.product.count({ where: { deletedAt: null } })
    const totalSuppliers = await prisma.supplier.count({ where: { deletedAt: null } })
    const products = await prisma.product.findMany({ where: { deletedAt: null } })
    const lowStockItems = products.filter((item) => item.quantity < item.lowStockThreshold).length
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const transactionsToday = await prisma.transaction.count({ where: { createdAt: { gte: today } } })
    return { totalProducts, totalSuppliers, lowStockItems, transactionsToday }
  })
}

export const getDashboardAnalytics = async (window: '7d' | '30d' | '90d'): Promise<unknown> => {
  const key = `dashboard:analytics:${window}`
  return getOrSet(key, 60, async () => {
    const days = Number(window.replace('d', ''))
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const transactions = await prisma.transaction.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'asc' } })
    const grouped = transactions.reduce<Record<string, number>>((acc, item) => {
      const date = item.createdAt.toISOString().slice(0, 10)
      acc[date] = (acc[date] ?? 0) + item.quantity
      return acc
    }, {})
    return Object.entries(grouped).map(([date, count]) => ({ date, count }))
  })
}

export const listNotifications = async (userId: string): Promise<unknown> => {
  await deleteCacheKey('dashboard:summary')
  return prisma.notification.findMany({
    where: { OR: [{ userId }, { userId: null }] },
    orderBy: { createdAt: 'desc' }
  })
}

export const markNotificationRead = async (id: string, userId: string): Promise<unknown> => {
  return prisma.notification.updateMany({ where: { id, OR: [{ userId }, { userId: null }] }, data: { isRead: true } })
}
