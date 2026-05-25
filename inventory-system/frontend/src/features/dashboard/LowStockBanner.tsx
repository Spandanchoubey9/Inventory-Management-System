interface LowStockBannerProps {
  count: number
}

const LowStockBanner = ({ count }: LowStockBannerProps): JSX.Element => {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
      <div className="text-sm uppercase tracking-[0.2em]">Low Stock Alert</div>
      <div className="mt-2 text-2xl font-semibold">{count} product{count === 1 ? '' : 's'} below threshold</div>
      <p className="mt-2 text-sm text-amber-800">Review inventory levels and restock products before stockouts occur.</p>
    </div>
  )
}

export default LowStockBanner
