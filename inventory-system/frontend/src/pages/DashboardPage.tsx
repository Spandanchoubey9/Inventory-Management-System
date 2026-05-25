import { useQuery } from '@tanstack/react-query'
import { fetchSummary, fetchAnalytics } from '../api/dashboard.api'
import StatsCard from '../features/dashboard/StatsCard'
import StockChart from '../features/dashboard/StockChart'
import LowStockBanner from '../features/dashboard/LowStockBanner'

const DashboardPage = (): JSX.Element => {
  const { data: summary } = useQuery({ queryKey: ['dashboard-summary'], queryFn: fetchSummary })
  const { data: analytics } = useQuery({ queryKey: ['dashboard-analytics', { window: '30d' }], queryFn: () => fetchAnalytics('30d') })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Products" value={summary?.totalProducts ?? 0} />
        <StatsCard title="Total Suppliers" value={summary?.totalSuppliers ?? 0} />
        <StatsCard title="Low Stock Items" value={summary?.lowStockItems ?? 0} />
        <StatsCard title="Transactions Today" value={summary?.transactionsToday ?? 0} />
      </div>
      <LowStockBanner count={summary?.lowStockItems ?? 0} />
      <div className="grid gap-4 lg:grid-cols-2">
        <StockChart data={analytics ?? []} />
      </div>
    </div>
  )
}

export default DashboardPage
