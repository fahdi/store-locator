import { useState } from 'react'
import { X, Clock, MapPin, Phone, Mail, Globe, Store, Image as ImageIcon, Settings, ToggleLeft, ToggleRight } from 'lucide-react'
import { Mall, Store as StoreType } from '../types'
import { useAuth } from '../hooks/useAuth'
import { mallService } from '../services/mallService'
import ConfirmationDialog from './ConfirmationDialog'
import StoreEditForm from './StoreEditForm'

interface DetailModalProps {
  isOpen: boolean
  loading?: boolean
  onClose: () => void
  mall?: Mall
  store?: StoreType & { mallName?: string }
  onMallUpdate?: (mall: { id: number; name: string; isOpen: boolean }) => void
  onStoreUpdate?: (store: { id: number; name: string; isOpen: boolean; mallId: number }) => void
}

export default function DetailModal({ isOpen, loading = false, onClose, mall, store, onMallUpdate, onStoreUpdate }: DetailModalProps) {
  const { user, isAuthenticated } = useAuth()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmationType, setConfirmationType] = useState<'mall' | 'store'>('mall')
  const [isToggling, setIsToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  
  if (!isOpen) return null

  const isStoreDetail = !!store
  const title = isStoreDetail ? store.name : mall?.name
  const subtitle = isStoreDetail ? store.mallName : `${mall?.stores.length} stores`
  
  // Role-based permissions
  const canToggleMall = isAuthenticated && user?.role === 'admin' && !isStoreDetail && mall
  const canToggleStore = isAuthenticated && user?.role === 'manager' && isStoreDetail && store
  const canEditStore = isAuthenticated && user?.role === 'store' && isStoreDetail && store
  
  // Action handlers
  const handleMallToggle = () => {
    if (!canToggleMall || !mall) return
    setError(null)
    setConfirmationType('mall')
    setShowConfirmDialog(true)
  }

  const confirmToggle = async () => {
    setIsToggling(true)
    setError(null)
    
    try {
      if (confirmationType === 'mall' && mall) {
        const result = await mallService.toggleMall(mall.id)
        
        // Notify parent component of the update
        if (onMallUpdate) {
          onMallUpdate(result.mall)
        }
      } else if (confirmationType === 'store' && store) {
        // Find the mall ID for this store
        const mallId = store.mallId || (store as StoreType & { mallId?: number }).mallId
        if (!mallId) {
          throw new Error('Cannot determine mall ID for store')
        }
        
        const result = await mallService.toggleStore(mallId, store.id)
        
        // Notify parent component of the update
        if (onStoreUpdate) {
          onStoreUpdate(result.store)
        }
      }
      
      // Close confirmation dialog
      setShowConfirmDialog(false)
      
      // Show success message briefly then close modal
      setTimeout(() => {
        onClose()
      }, 1000)
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      console.error(`${confirmationType} toggle failed:`, error)
    } finally {
      setIsToggling(false)
    }
  }
  
  const handleStoreToggle = () => {
    if (!canToggleStore || !store) return
    setError(null)
    setConfirmationType('store')
    setShowConfirmDialog(true)
  }
  
  const handleStoreEdit = () => {
    if (!canEditStore || !store) return
    setError(null)
    setShowEditForm(true)
  }
  
  const handleStoreEditUpdate = (updatedStore: StoreType & { mallId: number }) => {
    // Update local store data if needed
    if (onStoreUpdate) {
      onStoreUpdate(updatedStore)
    }
    setShowEditForm(false)
    // Close detail modal after successful edit
    setTimeout(() => {
      onClose()
    }, 500)
  }

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
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 flex-shrink-0 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Operation Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading details...</span>
            </div>
          ) : (
            <>
              {/* Image Display */}
              <div className="relative">
                <div className="w-full h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-gray-500">Image placeholder</span>
                  </div>
                </div>
              </div>
              
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
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Opening Hours</span>
                      </div>
                      <div className="ml-6">
                        {store.opening_hours.split(',').map((hours, index) => (
                          <div key={index} className="text-sm text-gray-900 py-0.5">
                            {hours.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Mall-specific details */}
              {!isStoreDetail && mall && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">{mall.stores.length}</div>
                      <div className="text-xs text-gray-600">Total Stores</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {mall.stores.filter(store => store.isOpen).length}
                      </div>
                      <div className="text-xs text-gray-600">Currently Open</div>
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Stores in Mall</span>
                      <span className="text-xs text-gray-500">({mall.stores.length} total)</span>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg">
                      {mall.stores.map(store => (
                        <div key={store.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{store.name}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                store.isOpen 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {store.isOpen ? 'Open' : 'Closed'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{store.type}</span>
                          </div>
                          <Store className={`w-4 h-4 ${
                            store.isOpen ? 'text-green-500' : 'text-red-500'
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <div className="flex flex-col gap-3">
            
            {/* Role-Based Action Buttons */}
            {(canToggleMall || canToggleStore || canEditStore) && (
              <div className="flex flex-col sm:flex-row gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-1">
                  <div className="text-xs font-medium text-blue-700 mb-1">
                    {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Actions
                  </div>
                  <div className="text-xs text-blue-600">
                    {canToggleMall && `Toggle mall status and all stores`}
                    {canToggleStore && `Toggle store status`}
                    {canEditStore && `Edit store information`}
                  </div>
                </div>
                
                {/* Admin: Mall Toggle */}
                {canToggleMall && (
                  <button
                    onClick={handleMallToggle}
                    disabled={isToggling}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      mall?.isOpen
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isToggling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Processing...
                      </>
                    ) : mall?.isOpen ? (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        Close Mall
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        Open Mall
                      </>
                    )}
                  </button>
                )}
                
                {/* Manager: Store Toggle */}
                {canToggleStore && (
                  <button
                    onClick={handleStoreToggle}
                    disabled={isToggling}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      store?.isOpen
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isToggling && confirmationType === 'store' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Processing...
                      </>
                    ) : store?.isOpen ? (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        Close Store
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        Open Store
                      </>
                    )}
                  </button>
                )}
                
                {/* Store: Edit Button */}
                {canEditStore && (
                  <button
                    onClick={handleStoreEdit}
                    disabled={isToggling}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Store
                  </button>
                )}
              </div>
            )}
            
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isStoreDetail && store ? (
                <>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </button>
                  {store.contact?.phone && (
                    <a
                      href={`tel:${store.contact.phone}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Store
                    </a>
                  )}
                </>
              ) : (
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  View All Stores
                </button>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="sm:w-auto w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          if (!isToggling) {
            setShowConfirmDialog(false)
            setError(null)
          }
        }}
        onConfirm={confirmToggle}
        title={confirmationType === 'mall' 
          ? `${mall?.isOpen ? 'Close' : 'Open'} Mall`
          : `${store?.isOpen ? 'Close' : 'Open'} Store`
        }
        message={confirmationType === 'mall'
          ? `Are you sure you want to ${mall?.isOpen ? 'close' : 'open'} ${mall?.name}? This will ${mall?.isOpen ? 'close' : 'open'} all ${mall?.stores.length} stores in this mall.`
          : `Are you sure you want to ${store?.isOpen ? 'close' : 'open'} ${store?.name}?${!store?.isOpen ? ' Note: The store can only be opened if the parent mall is open.' : ''}`
        }
        confirmText={confirmationType === 'mall'
          ? (mall?.isOpen ? 'Close Mall' : 'Open Mall')
          : (store?.isOpen ? 'Close Store' : 'Open Store')
        }
        confirmVariant={confirmationType === 'mall'
          ? (mall?.isOpen ? 'danger' : 'primary')
          : (store?.isOpen ? 'danger' : 'primary')
        }
        isLoading={isToggling}
      />
      
      {/* Store Edit Form */}
      {showEditForm && store && store.mallId && (
        <StoreEditForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          store={store as any}
          onStoreUpdate={handleStoreEditUpdate}
        />
      )}
    </div>
  )
}