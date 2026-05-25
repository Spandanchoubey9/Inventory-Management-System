import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  role?: 'ADMIN' | 'STAFF'
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps): JSX.Element => {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role && user.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Access denied</h1>
        <p className="mt-3 text-slate-600">You do not have permission to view this page. Contact an administrator if you believe this is an error.</p>
      </div>
    )
  }

  return <>{children}</>
}
