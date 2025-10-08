import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Mock useAuth hook
const mockUseAuth = {
  isAuthenticated: false,
  user: null as any,
  token: null,
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false
}

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

const TestComponent = () => <div>Protected Content</div>

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.isAuthenticated = false
    mockUseAuth.user = null
    mockUseAuth.isLoading = false
  })

  it('should show loading spinner when authentication is loading', () => {
    mockUseAuth.isLoading = true
    
    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.isAuthenticated = false
    
    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    // Should not render protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should render children when authenticated', () => {
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = {
      username: 'admin',
      role: 'admin',
      token: 'test-token'
    }
    
    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should render children when authenticated and role matches', () => {
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = {
      username: 'admin',
      role: 'admin',
      token: 'test-token'
    }
    
    render(
      <TestWrapper>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should show access denied when authenticated but role does not match', () => {
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = {
      username: 'store',
      role: 'store',
      token: 'test-token'
    }
    
    render(
      <TestWrapper>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
    expect(screen.getByText(/You don't have permission to access this page/)).toBeInTheDocument()
    expect(screen.getByText('Required role: admin')).toBeInTheDocument()
    expect(screen.getByText('Your current role: store')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should test all role combinations for access control', () => {
    const roles = ['admin', 'manager', 'store'] as const
    
    roles.forEach(userRole => {
      roles.forEach(requiredRole => {
        // Reset mocks
        vi.clearAllMocks()
        mockUseAuth.isAuthenticated = true
        mockUseAuth.user = {
          username: userRole,
          role: userRole,
          token: 'test-token'
        }

        const { unmount } = render(
          <TestWrapper>
            <ProtectedRoute requiredRole={requiredRole}>
              <TestComponent />
            </ProtectedRoute>
          </TestWrapper>
        )

        if (userRole === requiredRole) {
          expect(screen.getByText('Protected Content')).toBeInTheDocument()
          expect(screen.queryByText('Access Denied')).not.toBeInTheDocument()
        } else {
          expect(screen.getByText('Access Denied')).toBeInTheDocument()
          expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
        }

        unmount()
      })
    })
  })

  it('should handle undefined user gracefully when checking role', () => {
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = null // This shouldn't happen, but test edge case
    
    render(
      <TestWrapper>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('should allow access without role requirement when authenticated', () => {
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = {
      username: 'store',
      role: 'store',
      token: 'test-token'
    }
    
    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument()
  })

  it('should have proper accessibility in access denied state', () => {
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = {
      username: 'store',
      role: 'store',
      token: 'test-token'
    }
    
    render(
      <TestWrapper>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    const goBackButton = screen.getByRole('button', { name: /go back/i })
    expect(goBackButton).toBeInTheDocument()
    expect(goBackButton).not.toBeDisabled()
  })

  it('should handle loading state with proper accessibility', () => {
    mockUseAuth.isLoading = true
    
    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    const loadingText = screen.getByText('Loading...')
    expect(loadingText).toBeInTheDocument()
  })
})