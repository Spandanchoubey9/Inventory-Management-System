interface DashboardCardsProps {
  totalProducts: number
  lowStockCount: number
  totalTransactions: number
}

const DashboardCards = ({ totalProducts, lowStockCount, totalTransactions }: DashboardCardsProps): JSX.Element => {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Products</div>
        <div className="mt-4 text-4xl font-semibold text-slate-900">{totalProducts}</div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Low Stock</div>
        <div className="mt-4 text-4xl font-semibold text-slate-900">{lowStockCount}</div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Transactions</div>
        <div className="mt-4 text-4xl font-semibold text-slate-900">{totalTransactions}</div>
      </div>
    </div>
  )
}

export default DashboardCards
