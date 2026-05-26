import { NavLink, Outlet } from 'react-router-dom'
import { Bell, Home, Box, DollarSign, Users, Layers, Settings, FileText, Sparkles } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'
import { useAuthStore } from '../store/authStore'
import { logoutRequest } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'
import Toast from './Toast'

const navItems = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'Products', path: '/products', icon: Box },
  { label: 'Transactions', path: '/transactions', icon: DollarSign },
  { label: 'Suppliers', path: '/suppliers', icon: Users },
  { label: 'Categories', path: '/categories', icon: Layers },
  { label: 'Audit Logs', path: '/audit-logs', icon: FileText, adminOnly: true },
  { label: 'Settings', path: '/settings', icon: Settings }
]

const Layout = (): JSX.Element => {
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const user = useAuthStore((state) => state.user)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const { logout } = useAuth()

  const handleSignOut = async (): Promise<void> => {
    try {
      if (refreshToken) {
        await logoutRequest(refreshToken)
      }
    } catch {
      // We still clear local session if remote token revoke fails.
    } finally {
      logout()
    }
  }

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-slate-100">
      <aside className="glass-panel w-72 shrink-0 border-r border-rose-100 px-6 py-8 dark:border-slate-700/70">
        <div className="mb-10">
          <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-cyan-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Inventory</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Fast, reliable stock management for your team.</p>
        </div>
        <nav className="space-y-2">
          {navItems
            .filter((item) => !item.adminOnly || user?.role === 'ADMIN')
            .map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${isActive ? 'bg-gradient-to-r from-pink-500 via-orange-500 to-cyan-600 text-white shadow-sm' : 'text-slate-700 hover:bg-white/70 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-white'}`
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
        <header className="glass-panel mb-6 flex flex-col gap-4 rounded-3xl border border-white/70 p-5 shadow-sm dark:border-slate-700/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">Inventory Dashboard</div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Manage products, suppliers, categories, and transactions from one polished workspace.</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-2 text-sm font-medium text-slate-700 dark:from-slate-700 dark:to-indigo-800 dark:text-slate-100">
              <Sparkles className="h-4 w-4" />
              {user ? `Signed in as ${user.name} (${user.role})` : 'Signed out'}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-100 to-indigo-100 px-4 py-2 text-sm text-slate-700 dark:from-slate-800 dark:to-cyan-900 dark:text-slate-100">
              <Bell className="h-4 w-4" />
              {unreadCount} notification{unreadCount === 1 ? '' : 's'}
            </div>
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            )}
          </div>
        </header>
        <Outlet />
      </div>
      <Toast />
    </div>
  )
}

export default Layout
