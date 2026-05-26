import { useQuery } from '@tanstack/react-query'
import { fetchSummary, fetchAnalytics } from '../api/dashboard.api'
import StatsCard from '../features/dashboard/StatsCard'
import LowStockBanner from '../features/dashboard/LowStockBanner'
import { fetchProducts } from '../api/products.api'
import { fetchTransactions } from '../api/transactions.api'
import { fetchCategories } from '../api/categories.api'
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

const DashboardPage = (): JSX.Element => {
  const { data: summary } = useQuery({ queryKey: ['dashboard-summary'], queryFn: fetchSummary })
  const { data: analytics } = useQuery({ queryKey: ['dashboard-analytics', { window: '30d' }], queryFn: () => fetchAnalytics('30d') })
  const { data: productsRes } = useQuery({ queryKey: ['products', { page: 1, search: '' }], queryFn: fetchProducts })
  const { data: transactionsRes } = useQuery({ queryKey: ['transactions', { page: 1 }], queryFn: fetchTransactions })
  const { data: categoriesRes } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const products = productsRes?.data ?? []
  const categories = categoriesRes ?? []
  const transactions = transactionsRes?.data ?? []
  const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6']

  const productOverview = products.map((product) => ({ name: product.name.slice(0, 12), qty: product.quantity, price: product.price }))
  const categoryBuckets = products.reduce<Record<string, number>>((acc, item) => {
    acc[item.categoryId] = (acc[item.categoryId] ?? 0) + 1
    return acc
  }, {})
  const categoryNames = categories.reduce<Record<string, string>>((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})
  const categoryDistribution = Object.entries(categoryBuckets).map(([categoryId, total]) => ({ category: categoryNames[categoryId] ?? 'Uncategorized', total }))
  const transactionTrend = transactions
    .slice()
    .reverse()
    .map((item: { createdAt: string; quantity: number }) => ({ date: new Date(item.createdAt).toLocaleDateString(), quantity: item.quantity }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Products" value={summary?.totalProducts ?? 0} />
        <StatsCard title="Total Suppliers" value={summary?.totalSuppliers ?? 0} />
        <StatsCard title="Low Stock Items" value={summary?.lowStockItems ?? 0} />
        <StatsCard title="Transactions Today" value={summary?.transactionsToday ?? 0} />
      </div>
      <LowStockBanner count={summary?.lowStockItems ?? 0} />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-sky-700"><BarChart3 className="h-4 w-4" /> Products Overview</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productOverview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700"><PieChartIcon className="h-4 w-4" /> Category Distribution</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="total" nameKey="category" outerRadius={92} label={false}>
                  {categoryDistribution.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-violet-700"><TrendingUp className="h-4 w-4" /> Transactions Trend</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionTrend.length > 0 ? transactionTrend : (analytics ?? []).map((d) => ({ date: d.date, quantity: d.value }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantity" stroke="#7c3aed" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
