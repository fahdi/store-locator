import { X, Clock, MapPin, Phone, Globe, Store } from 'lucide-react'
import { Mall, Store as StoreType } from '../types'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  mall?: Mall
  store?: StoreType & { mallName?: string }
}

export default function DetailModal({ isOpen, onClose, mall, store }: DetailModalProps) {
  if (!isOpen) return null

  const isStoreDetail = !!store
  const title = isStoreDetail ? store.name : mall?.name
  const subtitle = isStoreDetail ? store.mallName : `${mall?.stores.length} stores`

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`p-4 border-b ${isStoreDetail ? 'bg-blue-50' : 'bg-green-50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {isStoreDetail ? (
                  <Store className="w-5 h-5 text-blue-600" />
                ) : (
                  <MapPin className="w-5 h-5 text-green-600" />
                )}
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {title}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              (isStoreDetail ? store.isOpen : mall?.isOpen)
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {(isStoreDetail ? store.isOpen : mall?.isOpen) ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Store-specific details */}
          {isStoreDetail && store && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <span className="text-sm text-gray-900 font-medium">{store.type}</span>
              </div>

              {store.opening_hours && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Opening Hours</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">{store.opening_hours}</p>
                </div>
              )}

              {store.description && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Description</span>
                  <p className="text-sm text-gray-900">{store.description}</p>
                </div>
              )}

              {/* Mock contact info */}
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900">+974 4444 {store.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a 
                    href={`https://${store.name.toLowerCase().replace(/\s+/g, '')}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Mall-specific details */}
          {!isStoreDetail && mall && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Stores:</span>
                  <span className="text-sm text-gray-900 font-medium">{mall.stores.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Open Stores:</span>
                  <span className="text-sm text-green-600 font-medium">
                    {mall.stores.filter(store => store.isOpen).length}
                  </span>
                </div>
              </div>

              {/* Store categories */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-600">Store Categories</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(mall.stores.map(store => store.type))).map(type => (
                    <span 
                      key={type}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Store list */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-600">Stores ({mall.stores.length})</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {mall.stores.map(store => (
                    <div key={store.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{store.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({store.type})</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${
                        store.isOpen ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              {mall.description && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">About</span>
                  <p className="text-sm text-gray-900">{mall.description}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 sm:py-2 px-4 rounded-lg transition-colors text-base sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}