import { useState } from 'react'
import { X, Save, Clock, Phone, Mail, Globe } from 'lucide-react'
import { Store } from '../types'
import { mallService, StoreUpdateData } from '../services/mallService'

interface StoreEditFormProps {
  isOpen: boolean
  onClose: () => void
  store: Store & { mallId: number; mallName?: string }
  onStoreUpdate?: (store: any) => void
}

export default function StoreEditForm({ isOpen, onClose, store, onStoreUpdate }: StoreEditFormProps) {
  const [formData, setFormData] = useState<StoreUpdateData>({
    name: store.name || '',
    description: store.description || '',
    opening_hours: store.opening_hours || '',
    type: store.type || '',
    contact: {
      phone: store.contact?.phone || '',
      email: store.contact?.email || '',
      website: store.contact?.website || ''
    }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (field: keyof StoreUpdateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }))
    setError(null)
  }

  const validateForm = (): string | null => {
    if (!formData.name?.trim()) {
      return 'Store name is required'
    }
    if (!formData.type?.trim()) {
      return 'Store category is required'
    }
    if (!formData.opening_hours?.trim()) {
      return 'Opening hours are required'
    }
    
    // Validate email format if provided
    if (formData.contact?.email && formData.contact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.contact.email)) {
        return 'Please enter a valid email address'
      }
    }

    // Validate phone format if provided
    if (formData.contact?.phone && formData.contact.phone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/
      if (!phoneRegex.test(formData.contact.phone)) {
        return 'Please enter a valid phone number'
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await mallService.updateStore(store.mallId, store.id, formData)
      
      // Notify parent component
      if (onStoreUpdate) {
        onStoreUpdate(result.store)
      }
      
      setSuccess(true)
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (error: any) {
      setError(error.message)
      console.error('Store update failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Form */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b bg-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Store Details
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {store.name} • {store.mallName}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-shrink-0 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="ml-3 text-sm font-medium text-green-800">
                  Store details updated successfully!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Update Failed</h3>
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

          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter store name"
              required
            />
          </div>

          {/* Store Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <input
              type="text"
              value={formData.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Electronics, Clothing, Food"
              required
            />
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Opening Hours *
            </label>
            <textarea
              value={formData.opening_hours || ''}
              onChange={(e) => handleInputChange('opening_hours', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Mon-Sun: 10:00 AM - 10:00 PM"
              rows={3}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Brief description of your store"
              rows={3}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Contact Information</h4>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.contact?.phone || ''}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="+974 XXXX XXXX"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.contact?.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="store@example.com"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Website
              </label>
              <input
                type="url"
                value={formData.contact?.website || ''}
                onChange={(e) => handleContactChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://www.yourstore.com"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || success}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : success ? (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}