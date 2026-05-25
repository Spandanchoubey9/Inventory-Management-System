interface StatsCardProps {
  title: string
  value: number
}

const StatsCard = ({ title, value }: StatsCardProps): JSX.Element => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</div>
      <div className="mt-4 text-4xl font-semibold text-slate-900">{value}</div>
    </div>
  )
}

export default StatsCard
