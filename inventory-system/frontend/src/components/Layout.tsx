import { NavLink, Outlet } from 'react-router-dom'
import { Bell, Home, Box, DollarSign, Users, Layers, Settings, FileText, Sparkles } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'
import { useAuthStore } from '../store/authStore'
import Toast from './Toast'

const navItems = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'Products', path: '/products', icon: Box },
  { label: 'Transactions', path: '/transactions', icon: DollarSign },
  { label: 'Suppliers', path: '/suppliers', icon: Users },
  { label: 'Categories', path: '/categories', icon: Layers },
  { label: 'Audit Logs', path: '/audit-logs', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings }
]

const Layout = (): JSX.Element => {
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-50 via-slate-50 to-indigo-50 text-slate-900">
      <aside className="w-72 shrink-0 border-r border-slate-200 bg-white/90 px-6 py-8 backdrop-blur">
        <div className="mb-10">
          <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Inventory</div>
          <p className="mt-2 text-sm text-slate-500">Fast, reliable stock management for your team.</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${isActive ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
      <div className="flex-1 p-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-3xl font-semibold tracking-tight">Inventory Dashboard</div>
            <p className="mt-2 text-sm text-slate-500">Manage products, suppliers, categories, and transactions from one polished workspace.</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              <Sparkles className="h-4 w-4" />
              {user ? `Signed in as ${user.name} (${user.role})` : 'Signed out'}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <Bell className="h-4 w-4" />
              {unreadCount} notification{unreadCount === 1 ? '' : 's'}
            </div>
          </div>
        </header>
        <Outlet />
      </div>
      <Toast />
    </div>
  )
}

export default Layout
