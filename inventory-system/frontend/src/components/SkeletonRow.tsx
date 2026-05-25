const SkeletonRow = (): JSX.Element => {
  return (
    <div className="animate-pulse space-y-2 py-4">
      <div className="h-4 rounded bg-slate-200"></div>
      <div className="h-4 rounded bg-slate-200"></div>
      <div className="h-4 rounded bg-slate-200"></div>
    </div>
  )
}

export default SkeletonRow
