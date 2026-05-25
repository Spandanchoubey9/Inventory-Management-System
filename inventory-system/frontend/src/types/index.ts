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

export interface Supplier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface Category {
  id: string
  name: string
  slug?: string
}

export interface Transaction {
  id: string
  productId: string
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'RETURN'
  quantity: number
  note?: string
  createdAt: string
}
