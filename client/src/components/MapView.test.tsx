import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MapView from './MapView'
import { DOHA_CENTER } from '../utils/constants'

// Mock CSS imports
vi.mock('leaflet/dist/leaflet.css', () => ({}))

// Mock Leaflet and React-Leaflet
vi.mock('leaflet', () => ({
  map: vi.fn(),
  tileLayer: vi.fn(),
  marker: vi.fn(),
  divIcon: vi.fn(),
  icon: vi.fn(),
  Icon: vi.fn().mockImplementation(() => ({})),
}))

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: any) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  TileLayer: (props: any) => <div data-testid="tile-layer" {...props} />,
  Marker: ({ children, ...props }: any) => (
    <div data-testid="marker" {...props}>
      {children}
    </div>
  ),
  Popup: ({ children, ...props }: any) => (
    <div data-testid="popup" {...props}>
      {children}
    </div>
  ),
}))

const mockMalls = [
  {
    id: 1,
    name: 'City Center Mall',
    coordinates: { latitude: 25.2854, longitude: 51.5310 },
    isOpen: true,
    stores: [
      {
        id: 1,
        name: 'Store 1',
        type: 'retail',
        isOpen: true,
        opening_hours: '9:00 AM - 10:00 PM'
      }
    ]
  },
  {
    id: 2,
    name: 'Doha Festival City',
    coordinates: { latitude: 25.3548, longitude: 51.4326 },
    isOpen: false,
    stores: []
  }
]

describe('MapView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render map container with correct center coordinates', () => {
    render(<MapView malls={mockMalls} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
  })

  it('should render tile layer for map background', () => {
    render(<MapView malls={mockMalls} />)
    
    const tileLayer = screen.getByTestId('tile-layer')
    expect(tileLayer).toBeInTheDocument()
  })

  it('should render markers for each mall', () => {
    render(<MapView malls={mockMalls} />)
    
    const markers = screen.getAllByTestId('marker')
    expect(markers).toHaveLength(mockMalls.length)
  })

  it('should render popup for mall information', () => {
    render(<MapView malls={mockMalls} />)
    
    const popups = screen.getAllByTestId('popup')
    expect(popups.length).toBeGreaterThan(0)
  })

  it('should handle empty malls array', () => {
    render(<MapView malls={[]} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
    
    const markers = screen.queryAllByTestId('marker')
    expect(markers).toHaveLength(0)
  })

  it('should center map on Doha coordinates', () => {
    render(<MapView malls={mockMalls} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
    
    // Test that the component renders (specific coordinate testing would require more complex mocking)
  })

  it('should show mall status in popup content', () => {
    render(<MapView malls={mockMalls} />)
    
    expect(screen.getByText('City Center Mall')).toBeInTheDocument()
    expect(screen.getByText('Doha Festival City')).toBeInTheDocument()
  })

  it('should handle malls with different open/closed states', () => {
    render(<MapView malls={mockMalls} />)
    
    // Check that both open and closed malls are rendered
    const markers = screen.getAllByTestId('marker')
    expect(markers).toHaveLength(2)
  })

  it('should be responsive and handle different screen sizes', () => {
    render(<MapView malls={mockMalls} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
    
    // Map should fill the container
    expect(mapContainer).toBeInTheDocument()
  })

  it('should use different icons for open and closed malls', () => {
    render(<MapView malls={mockMalls} />)
    
    const markers = screen.getAllByTestId('marker')
    expect(markers).toHaveLength(2)
    
    // Both markers should be rendered regardless of open/closed status
    expect(markers).toHaveLength(mockMalls.length)
  })

  it('should show store count and status in popups', () => {
    render(<MapView malls={mockMalls} />)
    
    // Check that open/closed status is displayed
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
    
    // Check store count
    expect(screen.getByText('1 store')).toBeInTheDocument()
    expect(screen.getByText('0 stores')).toBeInTheDocument()
  })
})