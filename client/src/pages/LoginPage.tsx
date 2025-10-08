import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { authAPI } from '../services/api'
import { DEFAULT_CREDENTIALS, USER_ROLES, ROUTES } from '../utils/constants'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(data.username, data.password)
      
      if (response.token) {
        const user = {
          username: response.username,
          role: response.role,
          token: response.token
        }
        login(response.token, user)
        toast.success(`Welcome ${response.username}! Logged in as ${response.role}`)
      } else {
        toast.error('Login failed - no token received')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (role: keyof typeof DEFAULT_CREDENTIALS) => {
    const credentials = DEFAULT_CREDENTIALS[role]
    setValue('username', credentials.username)
    setValue('password', credentials.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BlueSky Store Locator
          </h1>
          <p className="text-gray-600">
            Sign in to manage stores in Doha, Qatar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register('username')}
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">
            Quick login for demo:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin(USER_ROLES.ADMIN)}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded border border-red-200 transition duration-200"
            >
              Admin
              <br />
              <span className="text-xs opacity-75">admin/a</span>
            </button>
            <button
              onClick={() => handleQuickLogin(USER_ROLES.MANAGER)}
              className="text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded border border-yellow-200 transition duration-200"
            >
              Manager
              <br />
              <span className="text-xs opacity-75">manager/m</span>
            </button>
            <button
              onClick={() => handleQuickLogin(USER_ROLES.STORE)}
              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded border border-green-200 transition duration-200"
            >
              Store
              <br />
              <span className="text-xs opacity-75">store/s</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Click any role above to auto-fill credentials
          </p>
        </div>
      </div>
    </div>
  )
}