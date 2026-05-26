import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { getAuthStore } from './store/authStore'

const existingUser = getAuthStore().user
const themeKey = `inventory-theme:${existingUser?.id ?? 'guest'}`
const initialTheme = localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'
document.documentElement.classList.toggle('dark', initialTheme === 'dark')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
