import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './LoginPage'
import { AuthProvider } from '../context/AuthContext'
import { authAPI } from '../services/api'

// Mock the auth API
vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn()
  }
}))

// Mock useAuth hook for different scenarios
const mockLogin = vi.fn()
const mockUseAuth = {
  isAuthenticated: false,
  login: mockLogin,
  user: null,
  token: null,
  logout: vi.fn(),
  isLoading: false
}

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  </BrowserRouter>
)

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.isAuthenticated = false
  })

  it('should render login form with all elements', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(screen.getByText('BlueSky Store Locator')).toBeInTheDocument()
    expect(screen.getByText('Sign in to manage stores in Doha, Qatar')).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should render quick login buttons for demo', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(screen.getByText('Quick login for demo:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /manager/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /store/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('should auto-fill credentials when quick login button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const adminButton = screen.getByRole('button', { name: /admin/i })
    await user.click(adminButton)

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

    expect(usernameInput.value).toBe('admin')
    expect(passwordInput.value).toBe('a')
  })

  it('should handle successful login', async () => {
    const user = userEvent.setup()
    const mockAuthResponse = {
      token: 'mock-jwt-token',
      username: 'admin',
      role: 'admin' as const
    }

    vi.mocked(authAPI.login).mockResolvedValue(mockAuthResponse)
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'a')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('admin', 'a')
      expect(mockLogin).toHaveBeenCalledWith('mock-jwt-token', {
        username: 'admin',
        role: 'admin',
        token: 'mock-jwt-token'
      })
    })
  })

  it('should handle login failure', async () => {
    const user = userEvent.setup()
    
    vi.mocked(authAPI.login).mockRejectedValue(new Error('Login failed'))
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(usernameInput, 'invalid')
    await user.type(passwordInput, 'wrong')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('invalid', 'wrong')
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('should show loading state during login', async () => {
    const user = userEvent.setup()
    
    // Create a promise that we can control
    let resolveLogin: (value: any) => void
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve
    })
    
    vi.mocked(authAPI.login).mockReturnValue(loginPromise)
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'a')
    await user.click(submitButton)

    // Should show loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Resolve the login
    resolveLogin!({
      token: 'mock-token',
      username: 'admin',
      role: 'admin'
    })

    await waitFor(() => {
      expect(screen.queryByText('Signing in...')).not.toBeInTheDocument()
    })
  })

  it('should handle response without token', async () => {
    const user = userEvent.setup()
    
    vi.mocked(authAPI.login).mockResolvedValue({
      token: '',
      username: 'admin',
      role: 'admin'
    })
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'a')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('should redirect when already authenticated', () => {
    mockUseAuth.isAuthenticated = true

    const { container } = render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    // Should not render the login form
    expect(container.firstChild).toBeNull()
  })

  it('should test all role quick login buttons', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

    // Test Admin button
    await user.click(screen.getByRole('button', { name: /admin/i }))
    expect(usernameInput.value).toBe('admin')
    expect(passwordInput.value).toBe('a')

    // Test Manager button
    await user.click(screen.getByRole('button', { name: /manager/i }))
    expect(usernameInput.value).toBe('manager')
    expect(passwordInput.value).toBe('m')

    // Test Store button
    await user.click(screen.getByRole('button', { name: /store/i }))
    expect(usernameInput.value).toBe('store')
    expect(passwordInput.value).toBe('s')
  })

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(usernameInput).toHaveAttribute('type', 'text')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(usernameInput).toHaveAttribute('placeholder', 'Enter your username')
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password')
  })
})