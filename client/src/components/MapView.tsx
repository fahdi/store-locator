import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Mall } from '../types'
import { DOHA_CENTER } from '../utils/constants'

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

export default function MapView({ malls }: MapViewProps) {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={[DOHA_CENTER.latitude, DOHA_CENTER.longitude]}
        zoom={11}
        className="h-full w-full rounded-lg"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
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
              key={mall.id}
              position={[lat, lng]}
              icon={mall.isOpen ? openMallIcon : closedMallIcon}
            >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {mall.name}
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
      </MapContainer>
    </div>
  )
}