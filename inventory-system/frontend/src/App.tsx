import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import TransactionsPage from './pages/TransactionsPage'
import SuppliersPage from './pages/SuppliersPage'
import CategoriesPage from './pages/CategoriesPage'
import AuditLogsPage from './pages/AuditLogsPage'
import SettingsPage from './pages/SettingsPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="audit-logs" element={<ProtectedRoute role="ADMIN"><AuditLogsPage /></ProtectedRoute>} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
