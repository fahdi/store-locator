import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import toast from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})
import { Mall, Store } from '../types'
import { DOHA_CENTER } from '../utils/constants'
import { useDataService } from '../hooks/useDataService'
import DetailModal from './DetailModal'

interface MapViewProps {
  malls?: Mall[] // Make optional since we'll fetch data internally
}

// Custom icon for open malls
const openMallIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzEwQjk4MSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMTYgNkM5LjM3IDYgNCA5LjM3IDQgMTNDNCAyMC4yNSAxNiAyOCAxNiAyOEMxNiAyOCAyOCAyMC4yNSAyOCAxM0MyOCA5LjM3IDIyLjYzIDYgMTYgNlpNMTYgMTVDMTQuMzQgMTUgMTMgMTMuNjYgMTMgMTJDMTMgMTAuMzQgMTQuMzQgOSAxNiA5QzE3LjY2IDkgMTkgMTAuMzQgMTkgMTJDMTkgMTMuNjYgMTcuNjYgMTUgMTYgMTVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// Custom icon for closed malls
const closedMallIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iI0VGNDQ0NCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMTYgNkM5LjM3IDYgNCA5LjM3IDQgMTNDNCAyMC4yNSAxNiAyOCAxNiAyOEMxNiAyOCAyOCAyMC4yNSAyOCAxM0MyOCA5LjM3IDIyLjYzIDYgMTYgNlpNMTYgMTVDMTQuMzQgMTUgMTMgMTMuNjYgMTMgMTJDMTMgMTAuMzQgMTQuMzQgOSAxNiA5QzE3LjY2IDkgMTkgMTAuMzQgMTkgMTJDMTkgMTMuNjYgMTcuNjYgMTUgMTY MTVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// Custom icon for open stores (smaller, different color)
const openStoreIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMSIgZmlsbD0iIzA2ODhCMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMTIgNEMxMS40NSA0IDExIDQuNDUgMTEgNVYxMUg1QzQuNDUgMTEgNCAxMS40NSA0IDEyQzQgMTIuNTUgNC40NSAxMyA1IDEzSDExVjE5QzExIDE5LjU1IDExLjQ1IDIwIDEyIDIwQzEyLjU1IDIwIDEzIDE5LjU1IDEzIDE5VjEzSDE5QzE5LjU1IDEzIDIwIDEyLjU1IDIwIDEyQzIwIDExLjQ1IDE5LjU1IDExIDE5IDExSDEzVjVDMTMgNC40NSAxMi41NSA0IDEyIDRaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

// Custom icon for closed stores (smaller, different color)
const closedStoreIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMSIgZmlsbD0iI0RDMjYyNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNOSA5TDE1IDE1TTkgMTVMMTUgOSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

// Helper function to generate store coordinates (mimics server logic)
function generateStoreCoordinates(mallLat: number, mallLng: number, storeId: number, storeIndex: number) {
  // Create a more spread out pattern for stores around the mall
  const angle = (storeIndex * 90) + (storeId * 30) // Different angles for each store
  const distance = 0.002 + (storeIndex * 0.001) // Varying distances
  
  const offsetLat = Math.sin(angle * Math.PI / 180) * distance
  const offsetLng = Math.cos(angle * Math.PI / 180) * distance
  
  return {
    latitude: mallLat + offsetLat,
    longitude: mallLng + offsetLng
  }
}

export default function MapView({ malls: propMalls }: MapViewProps) {
  const { malls: fetchedMalls, loading, error, refreshData, clearError, retryCount } = useDataService()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    loading: boolean
    mall?: Mall
    store?: Store & { mallName?: string }
  }>({
    isOpen: false,
    loading: false
  })

  // Use prop malls if provided, otherwise use fetched malls
  const malls = propMalls || fetchedMalls

  const openMallModal = async (mall: Mall) => {
    // Show loading state immediately
    setModalState({ isOpen: true, loading: true })
    
    try {
      // Simulate API call to fetch detailed mall data
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failures (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error('Failed to load mall details'))
          } else {
            resolve(undefined)
          }
        }, 500)
      })
      
      // Set the mall data after "loading"
      setModalState({ isOpen: true, loading: false, mall, store: undefined })
      toast.success(`${mall.name} details loaded successfully`)
    } catch (error) {
      // Handle error case
      const errorMessage = error instanceof Error ? error.message : 'Failed to load mall details'
      toast.error(errorMessage)
      setModalState({ isOpen: false, loading: false })
    }
  }

  const openStoreModal = async (store: Store, mallName: string) => {
    // Show loading state immediately
    setModalState({ isOpen: true, loading: true })
    
    try {
      // Simulate API call to fetch detailed store data
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failures (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error('Failed to load store details'))
          } else {
            resolve(undefined)
          }
        }, 300)
      })
      
      // Set the store data after "loading"
      setModalState({ 
        isOpen: true, 
        loading: false,
        mall: undefined, 
        store: { ...store, mallName } 
      })
      toast.success(`${store.name} details loaded successfully`)
    } catch (error) {
      // Handle error case
      const errorMessage = error instanceof Error ? error.message : 'Failed to load store details'
      toast.error(errorMessage)
      setModalState({ isOpen: false, loading: false })
    }
  }

  const closeModal = () => {
    setModalState({ isOpen: false, loading: false })
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-600 text-lg font-medium mb-2">
            {retryCount > 0 ? 'Still Having Trouble Loading Map' : 'Failed to Load Map Data'}
          </div>
          <div className="text-gray-600 text-sm mb-4">{error}</div>
          {retryCount > 0 && (
            <div className="text-xs text-gray-500 mb-3">
              Attempted {retryCount} time{retryCount > 1 ? 's' : ''}
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <button 
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </button>
            <button 
              onClick={clearError}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state (only if no prop malls provided)
  if (!propMalls && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-sm">Loading map data...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full w-full relative overflow-hidden">
      <MapContainer
        center={[DOHA_CENTER.latitude, DOHA_CENTER.longitude]}
        zoom={11}
        style={{ height: '100%', width: '100%', minHeight: 'calc(100vh - 140px)' }}
        className="h-full w-full rounded-lg"
        zoomControl={true}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        
        {/* Mall Markers */}
        {malls.map((mall) => {
          const lat = mall.latitude
          const lng = mall.longitude
          
          // Skip malls without valid coordinates
          if (typeof lat !== 'number' || typeof lng !== 'number') {
            console.warn(`Mall ${mall.name} (ID: ${mall.id}) has invalid coordinates:`, { lat, lng, mall })
            return null
          }
          
          return (
            <Marker
              key={`mall-${mall.id}`}
              position={[lat, lng]}
              icon={mall.isOpen ? openMallIcon : closedMallIcon}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.getElement()?.classList.add('marker-hover-mall')
                },
                mouseout: (e) => {
                  e.target.getElement()?.classList.remove('marker-hover-mall')
                },
                click: () => {
                  openMallModal(mall)
                }
              }}
            >
            <Tooltip direction="top" offset={[0, -20]} opacity={0.9} permanent={false}>
              <div className="text-center">
                <div className="font-bold text-sm">🏬 {mall.name}</div>
                <div className="text-xs text-gray-600">
                  <span className="text-sm font-medium text-gray-600 mr-2">Stores:</span>
                  <span className="text-sm text-gray-900">
                    {mall.stores.length} {mall.stores.length === 1 ? 'store' : 'stores'}
                  </span>
                </div>
                {mall.stores.length > 0 && (
                  <div className="text-xs text-gray-600">
                    Active Stores: {mall.stores.filter(store => store.isOpen).length} open
                  </div>
                )}
              </div>
            </Tooltip>
            </Marker>
          )
        }).filter(Boolean)}

        {/* Store Markers */}
        {malls.flatMap((mall) => {
          const mallLat = mall.latitude
          const mallLng = mall.longitude
          
          // Skip malls without valid coordinates
          if (typeof mallLat !== 'number' || typeof mallLng !== 'number') {
            return []
          }
          
          return mall.stores.map((store, storeIndex) => {
            const storeCoords = generateStoreCoordinates(mallLat, mallLng, store.id, storeIndex)
            
            return (
              <Marker
                key={`store-${store.id}`}
                position={[storeCoords.latitude, storeCoords.longitude]}
                icon={store.isOpen ? openStoreIcon : closedStoreIcon}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.getElement()?.classList.add('marker-hover-store')
                  },
                  mouseout: (e) => {
                    e.target.getElement()?.classList.remove('marker-hover-store')
                  },
                  click: () => {
                    openStoreModal(store, mall.name)
                  }
                }}
              >
                <Tooltip direction="top" offset={[0, -15]} opacity={0.9} permanent={false}>
                  <div className="text-center">
                    <div className="font-bold text-sm">🏪 {store.name}</div>
                    <div className="text-xs text-gray-600">{store.type}</div>
                    <div className={`text-xs font-medium ${store.isOpen ? 'text-blue-600' : 'text-red-600'}`}>
                      {store.isOpen ? 'Open' : 'Closed'}
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            )
          })
        })}
      </MapContainer>
      </div>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={modalState.isOpen}
        loading={modalState.loading}
        onClose={closeModal}
        mall={modalState.mall}
        store={modalState.store}
      />
    </>
  )
}