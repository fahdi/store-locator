import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import DashboardPage from './DashboardPage'

// Mock useAuth hook
const mockLogout = vi.fn()
const mockUseAuth = {
  isAuthenticated: true,
  user: {
    username: 'admin',
    role: 'admin' as const,
    token: 'test-token'
  },
  token: 'test-token',
  login: vi.fn(),
  logout: mockLogout,
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

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.isAuthenticated = true
    mockUseAuth.user = {
      username: 'admin',
      role: 'admin',
      token: 'test-token'
    }
  })

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.isAuthenticated = false
    mockUseAuth.user = null

    const { container } = render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    // Should not render dashboard content
    expect(container.firstChild).toBeNull()
  })

  it('should render dashboard with user information', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('BlueSky Store Locator')).toBeInTheDocument()
    expect(screen.getByText('Welcome to your Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome,')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument() // Role badge
  })

  it('should render admin-specific capabilities', () => {
    mockUseAuth.user = {
      username: 'admin',
      role: 'admin',
      token: 'test-token'
    }

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Toggle entire malls open/close')).toBeInTheDocument()
    expect(screen.getByText('View all malls and stores')).toBeInTheDocument()
    expect(screen.getByText('Access admin dashboard')).toBeInTheDocument()
    expect(screen.getByText('Cascading control over all stores')).toBeInTheDocument()
  })

  it('should render manager-specific capabilities', () => {
    mockUseAuth.user = {
      username: 'manager',
      role: 'manager',
      token: 'test-token'
    }

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Toggle individual stores open/close')).toBeInTheDocument()
    expect(screen.getByText('View all stores in assigned malls')).toBeInTheDocument()
    expect(screen.getByText('Cannot open stores if mall is closed')).toBeInTheDocument()
    expect(screen.getByText('Manage store operations')).toBeInTheDocument()
  })

  it('should render store-specific capabilities', () => {
    mockUseAuth.user = {
      username: 'store',
      role: 'store',
      token: 'test-token'
    }

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Edit store details (name, hours, description)')).toBeInTheDocument()
    expect(screen.getByText('View own store information')).toBeInTheDocument()
    expect(screen.getByText('Update contact information')).toBeInTheDocument()
    expect(screen.getByText('Manage store content')).toBeInTheDocument()
  })

  it('should handle logout when header logout button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    const logoutButton = screen.getAllByText('Logout')[0] // Header logout button
    await user.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should handle logout when sidebar logout button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should display correct role colors for different users', () => {
    const roles = [
      { role: 'admin' as const, expectedClass: 'bg-red-100 text-red-800 border-red-200' },
      { role: 'manager' as const, expectedClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      { role: 'store' as const, expectedClass: 'bg-green-100 text-green-800 border-green-200' }
    ]

    roles.forEach(({ role, expectedClass }) => {
      mockUseAuth.user = {
        username: role,
        role,
        token: 'test-token'
      }

      const { unmount } = render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      )

      const roleBadges = screen.getAllByText(role)
      expect(roleBadges[0]).toHaveClass(...expectedClass.split(' '))

      unmount()
    })
  })

  it('should display development progress indicators', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Development Progress')).toBeInTheDocument()
    expect(screen.getByText('Phase 1: Foundation')).toBeInTheDocument()
    expect(screen.getByText('Complete ✅')).toBeInTheDocument()
    expect(screen.getByText('Phase 2: Authentication')).toBeInTheDocument()
    expect(screen.getByText('In Progress 🔄')).toBeInTheDocument()
    expect(screen.getByText('Phase 3: Map Integration')).toBeInTheDocument()
    expect(screen.getByText('Pending ⏳')).toBeInTheDocument()
  })

  it('should render role information section', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Role Information')).toBeInTheDocument()
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Authentication Status')).toBeInTheDocument()
    expect(screen.getByText('Authenticated')).toBeInTheDocument()
  })

  it('should render quick actions section', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('View Profile Settings')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('should handle undefined user gracefully', () => {
    mockUseAuth.user = null

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    // Should still render but with fallback values
    expect(screen.getByText('Welcome to your Dashboard')).toBeInTheDocument()
  })

  it('should have proper accessibility structure', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    // Check for proper heading hierarchy
    expect(screen.getByRole('banner')).toBeInTheDocument() // header
    expect(screen.getByRole('main')).toBeInTheDocument() // main content

    // Check for buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    // All buttons should be enabled (no disabled buttons in dashboard)
    buttons.forEach(button => {
      expect(button).not.toBeDisabled()
    })
  })

  it('should render next steps information', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Next Steps')).toBeInTheDocument()
    expect(screen.getByText(/The map integration and store management features will be available in Phase 3/)).toBeInTheDocument()
  })

  it('should display correct capabilities based on role prop', () => {
    // Test that capabilities change based on user role
    const testRoles = ['admin', 'manager', 'store'] as const
    
    testRoles.forEach(role => {
      mockUseAuth.user = {
        username: role,
        role,
        token: 'test-token'
      }

      const { unmount } = render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      )

      expect(screen.getByText(`You are logged in as ${role} with access to the following capabilities:`)).toBeInTheDocument()

      unmount()
    })
  })
})