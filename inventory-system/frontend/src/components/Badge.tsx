interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
  success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  danger: 'bg-rose-100 text-rose-800 border border-rose-200',
  info: 'bg-sky-100 text-sky-800 border border-sky-200'
}

const Badge = ({ children, variant = 'default' }: BadgeProps): JSX.Element => {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

export default Badge
