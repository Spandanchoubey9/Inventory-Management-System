import { useState } from 'react'
import { currencyOptions, useUserPreferences } from '../hooks/useUserPreferences'

const SettingsPage = (): JSX.Element => {
  const { theme, setTheme, currency, setCurrency } = useUserPreferences()
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(theme)
  const [activeCurrency, setActiveCurrency] = useState(currency)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
      <div className="glass-panel rounded-2xl border border-white/80 p-6 shadow-sm dark:border-slate-700/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Theme</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Light mode is default. Enable dark mode only when needed.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextTheme = activeTheme === 'dark' ? 'light' : 'dark'
              setActiveTheme(nextTheme)
              setTheme(nextTheme)
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTheme === 'dark' ? 'bg-gradient-to-r from-slate-700 via-indigo-700 to-cyan-700 text-white' : 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-900'}`}
          >
            {activeTheme === 'dark' ? 'Dark Enabled' : 'Light Enabled'}
          </button>
        </div>
      </div>
      <div className="glass-panel rounded-2xl border border-white/80 p-6 shadow-sm dark:border-slate-700/70">
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Transaction Currency</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">This preference is saved per user and used in transaction value displays.</p>
          <select
            value={activeCurrency}
            onChange={(e) => {
              const next = e.target.value
              setActiveCurrency(next)
              setCurrency(next)
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {currencyOptions.map((item) => (
              <option key={item.code} value={item.code}>{item.code} - {item.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
