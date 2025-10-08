import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Mall, Store } from '../types'
import { DOHA_CENTER } from '../utils/constants'
import DetailModal from './DetailModal'

interface MapViewProps {
  malls: Mall[]
}

// Custom icon for open malls
const openMallIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzEwQjk4MSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMTYgNkM5LjM3IDYgNCA5LjM3IDQgMTNDNCAyMC4yNSAxNiAyOCAxNiAyOEMxNiAyOCAyOCAyMC4yNSAyOCAxM0MyOCA5LjM3IDIyLjYzIDYgMTYgNlpNMTYgMTVDMTQuMzQgMTUgMTMgMTMuNjYgMTMgMTJDMTMgMTAuMzQgMTQuMzQgOSAxNiA5QzE3LjY2IDkgMTkgMTAuMzQgMTkgMTJDMTkgMTMuNjYgMTcuNjYgMTUgMTYgMTVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// Custom icon for closed malls
const closedMallIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iI0VGNDQ0NCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMTYgNkM5LjM3IDYgNCA5LjM3IDQgMTNDNCAyMC4yNSAxNiAyOCAxNiAyOEMxNiAyOCAyOCAyMC4yNSAyOCAxM0MyOCA5LjM3IDIyLjYzIDYgMTYgNlpNMTYgMTVDMTQuMzQgMTUgMTMgMTMuNjYgMTMgMTJDMTMgMTAuMzQgMTQuMzQgOSAxNiA5QzE3LjY2IDkgMTkgMTAuMzQgMTkgMTJDMTkgMTMuNjYgMTcuNjYgMTUgMTYgMTVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// Custom icon for open stores (smaller, different color)
const openStoreIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMSIgZmlsbD0iIzA2ODhCMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMTIgNEMxMS40NSA0IDExIDQuNDUgMTEgNVYxMUg1QzQuNDUgMTEgNCAxMS40NSA0IDEyQzQgMTIuNTUgNC40NSAxMyA1IDEzSDExVjE5QzExIDE5LjU1IDExLjQ1IDIwIDEyIDIwQzEyLjU1IDIwIDEzIDE5LjU1IDEzIDE5VjEzSDE5QzE5LjU1IDEzIDIwIDEyLjU1IDIwIDEyQzIwIDExLjQ1IDE5LjU1IDExIDE5IDExSDEzVjVDMTMgNC40NSAxMi41NSA0IDEyIDRaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

// Custom icon for closed stores (smaller, different color)
const closedStoreIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMSIgZmlsbD0iI0RDMjYyNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNOSA5TDE1IDE1TTkgMTVMMTUgOSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

// Helper function to generate store coordinates (mimics server logic)
function generateStoreCoordinates(mallLat: number, mallLng: number, storeId: number) {
  // Use store ID as seed for consistent positioning
  const seed = storeId * 0.001
  const offsetLat = (Math.sin(seed) * 0.01) // Slight offset from mall
  const offsetLng = (Math.cos(seed) * 0.01)
  
  return {
    latitude: mallLat + offsetLat,
    longitude: mallLng + offsetLng
  }
}

export default function MapView({ malls }: MapViewProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mall?: Mall
    store?: Store & { mallName?: string }
  }>({
    isOpen: false
  })

  const openMallModal = (mall: Mall) => {
    setModalState({ isOpen: true, mall, store: undefined })
  }

  const openStoreModal = (store: Store, mallName: string) => {
    setModalState({ 
      isOpen: true, 
      mall: undefined, 
      store: { ...store, mallName } 
    })
  }

  const closeModal = () => {
    setModalState({ isOpen: false })
  }

  return (
    <>
      <div className="h-full w-full">
      <MapContainer
        center={[DOHA_CENTER.latitude, DOHA_CENTER.longitude]}
        zoom={11}
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
          // Handle both data structures: direct lat/lng props and nested coordinates object
          const lat = mall.coordinates?.latitude || (mall as any).latitude
          const lng = mall.coordinates?.longitude || (mall as any).longitude
          
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
                  {mall.stores.filter(store => store.isOpen).length} of {mall.stores.length} stores open
                </div>
              </div>
            </Tooltip>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  🏬 {mall.name}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      mall.isOpen 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mall.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Stores:</span>
                    <span className="text-sm text-gray-900">
                      {mall.stores.length} {mall.stores.length === 1 ? 'store' : 'stores'}
                    </span>
                  </div>
                  
                  {mall.stores.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs font-medium text-gray-600">Active Stores:</span>
                      <div className="mt-1 text-xs text-gray-900">
                        {mall.stores.filter(store => store.isOpen).length} open
                      </div>
                    </div>
                  )}
                  
                  {mall.description && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-700">{mall.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
            </Marker>
          )
        }).filter(Boolean)}

        {/* Store Markers */}
        {malls.flatMap((mall) => {
          // Handle both data structures: direct lat/lng props and nested coordinates object
          const mallLat = mall.coordinates?.latitude || (mall as any).latitude
          const mallLng = mall.coordinates?.longitude || (mall as any).longitude
          
          // Skip malls without valid coordinates
          if (typeof mallLat !== 'number' || typeof mallLng !== 'number') {
            return []
          }
          
          return mall.stores.map((store) => {
            const storeCoords = generateStoreCoordinates(mallLat, mallLng, store.id)
            
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
                <Popup>
                  <div className="p-2 min-w-[180px]">
                    <h3 className="font-bold text-base text-gray-900 mb-2">
                      🏪 {store.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          store.isOpen 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {store.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 mr-2">Type:</span>
                        <span className="text-sm text-gray-900">{store.type}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 mr-2">Mall:</span>
                        <span className="text-sm text-gray-900">{mall.name}</span>
                      </div>
                      
                      {store.opening_hours && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs font-medium text-gray-600">Hours:</span>
                          <div className="mt-1 text-xs text-gray-900">{store.opening_hours}</div>
                        </div>
                      )}
                      
                      {store.description && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-700">{store.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })
        })}
      </MapContainer>
      </div>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mall={modalState.mall}
        store={modalState.store}
      />
    </>
  )
}