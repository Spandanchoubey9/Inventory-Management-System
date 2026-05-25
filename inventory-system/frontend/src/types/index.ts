export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface NotificationItem {
  id: string
  userId?: string
  type: string
  message: string
  entityId?: string
  isRead: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  categoryId: string
  price: number
  quantity: number
  lowStockThreshold: number
  imageUrl?: string
  isActive: boolean
}
