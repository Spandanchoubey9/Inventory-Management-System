import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema } from '../lib/schemas'
import { loginRequest, googleLoginRequest } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential?: string }) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          prompt: () => void
        }
      }
    }
  }
}

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [googleReady, setGoogleReady] = useState(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const form = useForm<{ email: string; password: string }>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: { email: string; password: string }): Promise<void> => {
    const result = await loginRequest(data)
    setAuth(result.user, result.accessToken, result.refreshToken)
    navigate('/')
  }

  const handleCredentialResponse = async (response: { credential?: string }): Promise<void> => {
    if (!response.credential) {
      return
    }

    const result = await googleLoginRequest({ credential: response.credential })
    setAuth(result.user, result.accessToken, result.refreshToken)
    navigate('/')
  }

  useEffect(() => {
    if (!googleClientId) {
      return
    }

    const existingScript = document.getElementById('google-identity-script')
    if (existingScript) {
      setGoogleReady(Boolean(window.google?.accounts?.id))
      return
    }

    const script = document.createElement('script')
    script.id = 'google-identity-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setGoogleReady(true)
    document.body.appendChild(script)

    return () => {
      if (script.parentElement) {
        script.parentElement.removeChild(script)
      }
    }
  }, [googleClientId])

  useEffect(() => {
    if (!googleClientId || !googleReady) {
      return
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })
    }
  }, [googleClientId, googleReady])

  const handleGoogleSignIn = (): void => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
    }
  }

  const googleConfigured = Boolean(googleClientId)
  const submitText = useMemo(() => (form.formState.isSubmitting ? 'Signing in...' : 'Sign In'), [form.formState.isSubmitting])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <p className="text-sm text-slate-500 mb-6">Use your email and password to sign in, or sign in with Google if configured.</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" {...form.register('email')} className="mt-1 w-full rounded-lg border px-3 py-2" />
            {form.formState.errors.email?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" {...form.register('password')} className="mt-1 w-full rounded-lg border px-3 py-2" />
            {form.formState.errors.password?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white">{submitText}</button>
        </form>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!googleConfigured}
            className={`w-full rounded-lg border px-4 py-2 text-slate-700 ${googleConfigured ? 'bg-white border-slate-300 hover:bg-slate-50' : 'bg-slate-100 border-slate-200 cursor-not-allowed'}`}
          >
            Sign in with Google
          </button>
          {!googleConfigured && (
            <p className="text-center text-xs text-slate-500">Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID and backend GOOGLE_CLIENT_ID.</p>
          )}
          <div className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => navigate('/register')} className="font-semibold text-slate-900 hover:underline">
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
