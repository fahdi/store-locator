import { useState, useEffect } from 'react'
import { 
  Store, 
  Clock,
  Edit3,
  Phone,
  Mail,
  Globe,
  MapPin,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle,
  ChevronDown,
  Building2,
  Users
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDataService } from '../hooks/useDataService'
import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

interface StoreInfo {
  id: number
  mallId: number
  name: string
  type: string
  isOpen: boolean
  opening_hours: string
  mallName: string
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
}

interface Mall {
  id: number
  name: string
  stores: Array<{
    id: number
    name: string
    type: string
    isOpen: boolean
    opening_hours: string
    contact?: {
      phone?: string
      email?: string
      website?: string
    }
  }>
}

export default function StoreDashboard() {
  const { user } = useAuth()
  const { malls, loading } = useDataService()
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null)
  const [allStores, setAllStores] = useState<StoreInfo[]>([])
  const [showStoreSelector, setShowStoreSelector] = useState(false)

  useEffect(() => {
    if (malls.length > 0) {
      // Flatten all stores from all malls
      const flattenedStores: StoreInfo[] = malls.flatMap((mall: Mall) => 
        mall.stores.map(store => ({
          id: store.id,
          mallId: mall.id,
          name: store.name,
          type: store.type,
          isOpen: store.isOpen,
          opening_hours: store.opening_hours,
          mallName: mall.name,
          contact: store.contact || {}
        }))
      )
      
      setAllStores(flattenedStores)
      
      // Set first store as default selection
      if (flattenedStores.length > 0 && !selectedStore) {
        setSelectedStore(flattenedStores[0])
      }
    }
  }, [malls, selectedStore])

  const handleStoreSelect = (store: StoreInfo) => {
    setSelectedStore(store)
    setShowStoreSelector(false)
  }

  if (loading || !selectedStore) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-xl h-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-40"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Store Management Portal
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Manage {allStores.length} stores</span>
              </div>
            </div>
            <p className="text-gray-600 text-lg mb-4">
              Complete access to edit all store details
            </p>
            
            {/* Store Selector */}
            <div className="relative">
              <button
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="flex items-center justify-between w-full max-w-md px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Store className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{selectedStore.name}</div>
                    <div className="text-sm text-gray-500">📍 {selectedStore.mallName}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  showStoreSelector ? 'rotate-180' : ''
                }`} />
              </button>
              
              {showStoreSelector && (
                <div className="absolute z-10 w-full max-w-md mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {allStores.map((store) => (
                    <button
                      key={`${store.mallId}-${store.id}`}
                      onClick={() => handleStoreSelect(store)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedStore.id === store.id && selectedStore.mallId === store.mallId
                          ? 'bg-blue-50 border-blue-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{store.name}</div>
                          <div className="text-sm text-gray-500">
                            📍 {store.mallName} • {store.type}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          store.isOpen 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {store.isOpen ? 'Open' : 'Closed'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStore.isOpen 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {selectedStore.isOpen ? 'Currently Open' : 'Currently Closed'}
              </div>
              <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                {selectedStore.type}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <Building2 className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Store Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Store Information</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Store Name</label>
                <p className="text-lg font-semibold text-gray-900">{selectedStore.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{selectedStore.mallName}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{selectedStore.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Store ID</label>
                <p className="text-gray-900">#{selectedStore.id} (Mall #{selectedStore.mallId})</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <label className="text-sm font-medium text-gray-500">Operating Hours</label>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedStore.opening_hours.split(',').map((hours, index) => (
                  <div key={index} className="text-sm text-gray-900 py-1">
                    {hours.trim()}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-500 mb-3 block">Contact Information</label>
              <div className="space-y-3">
                {selectedStore.contact?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedStore.contact.phone}</span>
                  </div>
                )}
                {selectedStore.contact?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedStore.contact.email}</span>
                  </div>
                )}
                {selectedStore.contact?.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedStore.contact.website}</span>
                  </div>
                )}
                {(!selectedStore.contact?.phone && !selectedStore.contact?.email && !selectedStore.contact?.website) && (
                  <p className="text-gray-500 text-sm italic">No contact information added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Updates */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <Edit3 className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Update Store Details</div>
                  <div className="text-sm text-gray-500">Edit name, description, hours</div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Update Contact Info</div>
                  <div className="text-sm text-gray-500">Phone, email, website</div>
                </div>
              </button>

              <Link
                to={ROUTES.HOME}
                className="w-full flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">View on Map</div>
                  <div className="text-sm text-gray-500">See store location</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Updates</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hours updated successfully</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Edit3 className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contact information added</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Store description updated</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}