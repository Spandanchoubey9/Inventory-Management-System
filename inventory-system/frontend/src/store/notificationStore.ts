import { create } from 'zustand'
import type { NotificationItem } from '../types'

interface NotificationState {
  items: NotificationItem[]
  unreadCount: number
  addNotification: (notification: NotificationItem) => void
  markRead: (id: string) => void
  setAll: (items: NotificationItem[]) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => ({
    items: [notification, ...state.items],
    unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
  })),
  markRead: (id) => set((state) => ({
    items: state.items.map((item) => item.id === id ? { ...item, isRead: true } : item),
    unreadCount: state.items.filter((item) => item.id !== id && !item.isRead).length
  })),
  setAll: (items) => set({ items, unreadCount: items.filter((item) => !item.isRead).length })
}))
