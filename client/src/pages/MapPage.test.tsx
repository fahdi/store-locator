import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MapPage from './MapPage'

// Mock the MapView component
vi.mock('../components/MapView', () => ({
  default: ({ malls }: { malls: any[] }) => (
    <div data-testid="map-view">
      <div data-testid="mall-count">{malls.length} malls</div>
      {malls.map(mall => (
        <div key={mall.id} data-testid={`mall-${mall.id}`}>
          {mall.name}
        </div>
      ))}
    </div>
  )
}))

// Mock the API
vi.mock('../services/api', () => ({
  mallAPI: {
    getAll: vi.fn()
  }
}))

// Mock useAuth hook
const mockUseAuth = {
  isAuthenticated: true,
  user: {
    username: 'admin',
    role: 'admin',
    token: 'test-token'
  },
  token: 'test-token',
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

const mockMalls = [
  {
    id: 1,
    name: 'City Center Mall',
    coordinates: { latitude: 25.2854, longitude: 51.5310 },
    isOpen: true,
    stores: []
  },
  {
    id: 2,
    name: 'Doha Festival City',
    coordinates: { latitude: 25.3548, longitude: 51.4326 },
    isOpen: false,
    stores: []
  }
]

describe('MapPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockUseAuth.isAuthenticated = true
    
    // Setup API mock
    const { mallAPI } = await import('../services/api')
    mallAPI.getAll.mockResolvedValue(mockMalls)
  })

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.isAuthenticated = false
    mockUseAuth.user = null

    const { container } = render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render loading state initially', async () => {
    const { mallAPI } = await import('../services/api')
    mallAPI.getAll.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    expect(screen.getByText('Loading map...')).toBeInTheDocument()
  })

  it('should fetch and display malls on the map', async () => {
    render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument()
    })

    expect(screen.getByTestId('mall-count')).toHaveTextContent('2 malls')
    expect(screen.getByTestId('mall-1')).toHaveTextContent('City Center Mall')
    expect(screen.getByTestId('mall-2')).toHaveTextContent('Doha Festival City')
  })

  it('should handle API errors gracefully', async () => {
    const { mallAPI } = await import('../services/api')
    mallAPI.getAll.mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Failed to load map data. Please try again.')).toBeInTheDocument()
    })
  })

  it('should show error state with retry button', async () => {
    const { mallAPI } = await import('../services/api')
    mallAPI.getAll.mockRejectedValue(new Error('Network Error'))

    render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Failed to load map data. Please try again.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('should handle empty malls array', async () => {
    const { mallAPI } = await import('../services/api')
    mallAPI.getAll.mockResolvedValue([])

    render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument()
    })

    expect(screen.getByTestId('mall-count')).toHaveTextContent('0 malls')
  })

  it('should have proper page title', async () => {
    render(
      <TestWrapper>
        <MapPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Store Locator Map')).toBeInTheDocument()
    })
  })
})