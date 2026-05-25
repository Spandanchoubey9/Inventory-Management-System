import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from '../lib/schemas'
import { registerRequest } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const form = useForm<{ name: string; email: string; password: string }>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: { name: string; email: string; password: string }): Promise<void> => {
    const result = await registerRequest(data)
    setAuth(result.user, result.accessToken, result.refreshToken)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6">Register a new user and sign in to your inventory dashboard.</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input type="text" {...form.register('name')} className="mt-1 w-full rounded-lg border px-3 py-2" />
            {form.formState.errors.name?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>
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
          <button type="submit" className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white">Create account</button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')} className="font-semibold text-slate-900 hover:underline">
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
