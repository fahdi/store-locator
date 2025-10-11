import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl } from 'react-leaflet'
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
import SearchOverlay, { SearchFilters } from './SearchOverlay'

interface MapViewProps {
  malls?: Mall[] // Make optional since we'll fetch data internally
}

// Custom icon for open malls - Large marker style
const openMallIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA0MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE1hcmtlciBTaGFkb3cgLS0+CiAgPGVsbGlwc2UgY3g9IjIwIiBjeT0iNDciIHJ4PSI2IiByeT0iMyIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iMC4yIi8+CiAgPCEtLSBNYXJrZXIgQm9keSAtLT4KICA8cGF0aCBkPSJNMjAgNEMxMC42IDQgMyAxMS42IDMgMjFDMyAzMy41IDIwIDQ2IDIwIDQ2UzM3IDMzLjUgMzcgMjFDMzcgMTEuNiAyOS40IDQgMjAgNFoiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPCEtLSBNYWxsIEljb24gLS0+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMSIgcj0iMTAiIGZpbGw9IiNmZmYiLz4KICA8IS0tIEJ1aWxkaW5nIEljb24gLS0+CiAgPHJlY3QgeD0iMTQiIHk9IjE3IiB3aWR0aD0iMTIiIGhlaWdodD0iOCIgZmlsbD0iIzEwYjk4MSIgcng9IjEiLz4KICA8cmVjdCB4PSIxNiIgeT0iMTkiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiLz4KICA8cmVjdCB4PSIyMCIgeT0iMTkiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiLz4KICA8cmVjdCB4PSIyNCIgeT0iMTkiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiLz4KICA8cmVjdCB4PSIxOCIgeT0iMjMiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiLz4KPC9zdmc+',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50],
})

// Custom icon for closed malls - Large marker style with X
const closedMallIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA0MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE1hcmtlciBTaGFkb3cgLS0+CiAgPGVsbGlwc2UgY3g9IjIwIiBjeT0iNDciIHJ4PSI2IiByeT0iMyIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iMC4yIi8+CiAgPCEtLSBNYXJrZXIgQm9keSAtLT4KICA8cGF0aCBkPSJNMjAgNEMxMC42IDQgMyAxMS42IDMgMjFDMyAzMy41IDIwIDQ2IDIwIDQ2UzM3IDMzLjUgMzcgMjFDMzcgMTEuNiAyOS40IDQgMjAgNFoiIGZpbGw9IiNkYzI2MjYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPCEtLSBYIE92ZXJsYXkgLS0+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMSIgcj0iMTAiIGZpbGw9IiNmZmYiLz4KICA8bGluZSB4MT0iMTQiIHkxPSIxNSIgeDI9IjI2IiB5Mj0iMjciIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8bGluZSB4MT0iMjYiIHkxPSIxNSIgeDI9IjE0IiB5Mj0iMjciIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50],
})

// Custom icon for open stores - Smaller marker style
const openStoreIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAzMCAzOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE1hcmtlciBTaGFkb3cgLS0+CiAgPGVsbGlwc2UgY3g9IjE1IiBjeT0iMzYiIHJ4PSI0LjUiIHJ5PSIyIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjIiLz4KICA8IS0tIE1hcmtlciBCb2R5IC0tPgogIDxwYXRoIGQ9Ik0xNSAzQzguOSAzIDQgNy45IDQgMTRDNCAyMy41IDE1IDM1IDE1IDM1UzI2IDIzLjUgMjYgMTRDMjYgNy45IDIxLjEgMyAxNSAzWiIgZmlsbD0iIzA2ODhiMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIuNSIvPgogIDwhLS0gU3RvcmUgSWNvbiAtLT4KICA8Y2lyY2xlIGN4PSIxNSIgY3k9IjE0IiByPSI3IiBmaWxsPSIjZmZmIi8+CiAgPCEtLSBTaG9wIEljb24gLS0+CiAgPHJlY3QgeD0iMTEiIHk9IjExIiB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDY4OGIwIiByeD0iMC41Ii8+CiAgPHJlY3QgeD0iMTIiIHk9IjEyIiB3aWR0aD0iMS41IiBoZWlnaHQ9IjEuNSIgZmlsbD0iI2ZmZiIvPgogIDxyZWN0IHg9IjE1IiB5PSIxMiIgd2lkdGg9IjEuNSIgaGVpZ2h0PSIxLjUiIGZpbGw9IiNmZmYiLz4KICA8cmVjdCB4PSIxNCIgeT0iMTUiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiLz4KPC9zdmc+',
  iconSize: [30, 38],
  iconAnchor: [15, 38],
  popupAnchor: [0, -38],
})

// Custom icon for closed stores - Smaller marker style with X
const closedStoreIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAzMCAzOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE1hcmtlciBTaGFkb3cgLS0+CiAgPGVsbGlwc2UgY3g9IjE1IiBjeT0iMzYiIHJ4PSI0LjUiIHJ5PSIyIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjIiLz4KICA8IS0tIE1hcmtlciBCb2R5IC0tPgogIDxwYXRoIGQ9Ik0xNSAzQzguOSAzIDQgNy45IDQgMTRDNCAyMy41IDE1IDM1IDE1IDM1UzI2IDIzLjUgMjYgMTRDMjYgNy45IDIxLjEgMyAxNSAzWiIgZmlsbD0iI2RjMjYyNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIuNSIvPgogIDwhLS0gWCBPdmVybGF5IC0tPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTQiIHI9IjciIGZpbGw9IiNmZmYiLz4KICA8bGluZSB4MT0iMTEiIHkxPSIxMCIgeDI9IjE5IiB5Mj0iMTgiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxsaW5lIHgxPSIxOSIgeTE9IjEwIiB4Mj0iMTEiIHkyPSIxOCIgc3Ryb2tlPSIjZGMyNjI2IiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==',
  iconSize: [30, 38],
  iconAnchor: [15, 38],
  popupAnchor: [0, -38],
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
  const [localMalls, setLocalMalls] = useState<Mall[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    showMalls: true,
    showStores: true,
    showOpen: true,
    showClosed: true,
    storeType: 'all'
  })
  const mapRef = useRef<any>(null)

  // Use prop malls if provided, otherwise use fetched malls
  // localMalls will override for real-time updates
  const malls = localMalls.length > 0 ? localMalls : (propMalls || fetchedMalls)
  
  // Update local malls when fetched malls change
  useEffect(() => {
    if (fetchedMalls.length > 0) {
      setLocalMalls(fetchedMalls)
    }
  }, [fetchedMalls])
  
  // Handle mall updates from DetailModal
  const handleMallUpdate = (updatedMall: { id: number; name: string; isOpen: boolean }) => {
    setLocalMalls(prevMalls => 
      prevMalls.map(mall => 
        mall.id === updatedMall.id 
          ? { 
              ...mall, 
              isOpen: updatedMall.isOpen,
              // Update all stores in the mall to match mall status (cascading)
              stores: mall.stores.map(store => ({ 
                ...store, 
                isOpen: updatedMall.isOpen 
              }))
            }
          : mall
      )
    )
    
    // Show success toast
    toast.success(`${updatedMall.name} has been ${updatedMall.isOpen ? 'opened' : 'closed'}`)
  }
  
  // Handle store updates from DetailModal
  const handleStoreUpdate = (updatedStore: { id: number; name: string; isOpen: boolean; mallId: number }) => {
    setLocalMalls(prevMalls => 
      prevMalls.map(mall => 
        mall.id === updatedStore.mallId
          ? {
              ...mall,
              stores: mall.stores.map(store => 
                store.id === updatedStore.id
                  ? { ...store, isOpen: updatedStore.isOpen }
                  : store
              )
            }
          : mall
      )
    )
    
    // Show success toast
    toast.success(`${updatedStore.name} has been ${updatedStore.isOpen ? 'opened' : 'closed'}`)
  }

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
    } catch (error) {
      // Handle error case
      const errorMessage = error instanceof Error ? error.message : 'Failed to load mall details'
      toast.error(errorMessage)
      setModalState({ isOpen: false, loading: false })
    }
  }

  const openStoreModal = async (store: Store, mallName: string, mallId: number) => {
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
      
      // Set the store data after "loading" with mallId included
      setModalState({ 
        isOpen: true, 
        loading: false,
        mall: undefined, 
        store: { ...store, mallName, mallId } 
      })
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

  // Handle search overlay interactions
  const handleMallSelectFromSearch = (mall: Mall) => {
    openMallModal(mall)
    // Center map on selected mall
    if (mapRef.current) {
      mapRef.current.setView([mall.latitude, mall.longitude], 14)
    }
  }

  const handleStoreSelectFromSearch = (store: Store, mallName: string, mallId: number) => {
    openStoreModal(store, mallName, mallId)
    // Center map on store's mall
    const mall = malls.find(m => m.id === mallId)
    if (mall && mapRef.current) {
      const storeCoords = generateStoreCoordinates(mall.latitude, mall.longitude, store.id, mall.stores.indexOf(store))
      mapRef.current.setView([storeCoords.latitude, storeCoords.longitude], 16)
    }
  }

  const handleFilterChange = (filters: SearchFilters) => {
    setSearchFilters(filters)
  }

  // Filter malls and stores based on search filters
  const getFilteredMalls = () => {
    return malls.map(mall => {
      // Filter stores
      const filteredStores = mall.stores.filter(store => {
        const statusMatch = (store.isOpen && searchFilters.showOpen) || (!store.isOpen && searchFilters.showClosed)
        const typeMatch = searchFilters.storeType === 'all' || store.type === searchFilters.storeType
        const searchMatch = !searchFilters.searchTerm || 
          store.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
          store.type.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
        
        return statusMatch && typeMatch && searchMatch && searchFilters.showStores
      })

      // Check if mall should be shown
      const mallStatusMatch = (mall.isOpen && searchFilters.showOpen) || (!mall.isOpen && searchFilters.showClosed)
      const mallSearchMatch = !searchFilters.searchTerm || 
        mall.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
      const showMall = mallStatusMatch && mallSearchMatch && searchFilters.showMalls

      return {
        ...mall,
        stores: filteredStores,
        _showMall: showMall
      }
    }).filter(mall => mall._showMall || mall.stores.length > 0)
  }

  const filteredMalls = getFilteredMalls()

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
        {/* Search Overlay */}
        <SearchOverlay
          malls={malls}
          onMallSelect={handleMallSelectFromSearch}
          onStoreSelect={handleStoreSelectFromSearch}
          onFilterChange={handleFilterChange}
        />

        <MapContainer
          ref={mapRef}
          center={[DOHA_CENTER.latitude, DOHA_CENTER.longitude]}
          zoom={11}
          style={{ height: '100%', width: '100%', minHeight: 'calc(100vh - 140px)' }}
          className="h-full w-full rounded-lg"
          zoomControl={false}
          scrollWheelZoom={true}
          touchZoom={true}
          doubleClickZoom={true}
          dragging={true}
          attributionControl={true}
          zoomAnimation={true}
          fadeAnimation={true}
          markerZoomAnimation={true}
          zoomSnap={0.5}
          zoomDelta={0.5}
          wheelDebounceTime={40}
          wheelPxPerZoomLevel={60}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Custom positioned zoom control */}
        <ZoomControl position="bottomright" />
        
        
        {/* Mall Markers */}
        {filteredMalls.filter(mall => mall._showMall).map((mall) => {
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
        {filteredMalls.flatMap((mall) => {
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
                    openStoreModal(store, mall.name, mall.id)
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
        onMallUpdate={handleMallUpdate}
        onStoreUpdate={handleStoreUpdate}
      />
    </>
  )
}