import { useMemo } from 'react'
import { useAuthStore } from '../store/authStore'

export interface CurrencyOption {
  code: string
  label: string
  symbol: string
}

export const currencyOptions: CurrencyOption[] = [
  { code: 'INR', label: 'Indian Rupee', symbol: 'Rs' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: 'EUR' },
  { code: 'GBP', label: 'British Pound', symbol: 'GBP' },
  { code: 'JPY', label: 'Japanese Yen', symbol: 'JPY' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: 'CNY' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'AUD' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CAD' },
  { code: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'SGD' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'AED' },
  { code: 'SAR', label: 'Saudi Riyal', symbol: 'SAR' },
  { code: 'NZD', label: 'New Zealand Dollar', symbol: 'NZD' },
  { code: 'SEK', label: 'Swedish Krona', symbol: 'SEK' },
  { code: 'NOK', label: 'Norwegian Krone', symbol: 'NOK' },
  { code: 'DKK', label: 'Danish Krone', symbol: 'DKK' },
  { code: 'HKD', label: 'Hong Kong Dollar', symbol: 'HKD' },
  { code: 'ZAR', label: 'South African Rand', symbol: 'ZAR' },
  { code: 'BRL', label: 'Brazilian Real', symbol: 'BRL' },
  { code: 'MXN', label: 'Mexican Peso', symbol: 'MXN' }
]

const themeKey = (userId: string): string => `inventory-theme:${userId}`
const currencyKey = (userId: string): string => `inventory-currency:${userId}`

const getPreferredCurrency = (userId: string): string => {
  const saved = localStorage.getItem(currencyKey(userId))
  return currencyOptions.some((item) => item.code === saved) ? (saved as string) : 'INR'
}

const getPreferredTheme = (userId: string): 'light' | 'dark' => {
  return localStorage.getItem(themeKey(userId)) === 'dark' ? 'dark' : 'light'
}

export const useUserPreferences = () => {
  const user = useAuthStore((state) => state.user)
  const userId = user?.id ?? 'guest'

  const theme = getPreferredTheme(userId)
  const currency = getPreferredCurrency(userId)

  const formatCurrency = useMemo(() => {
    return (amount: number): string =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2
      }).format(amount)
  }, [currency])

  const setTheme = (nextTheme: 'light' | 'dark'): void => {
    localStorage.setItem(themeKey(userId), nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }

  const setCurrency = (nextCurrency: string): void => {
    if (!currencyOptions.some((item) => item.code === nextCurrency)) {
      return
    }
    localStorage.setItem(currencyKey(userId), nextCurrency)
  }

  return { theme, currency, setTheme, setCurrency, formatCurrency }
}
