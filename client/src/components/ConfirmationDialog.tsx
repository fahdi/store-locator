import { X, AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  confirmVariant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = 'primary',
  isLoading = false
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const getConfirmButtonClasses = () => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    
    switch (confirmVariant) {
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white`
      case 'warning':
        return `${baseClasses} bg-yellow-600 hover:bg-yellow-700 text-white`
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`
    }
  }

  const getIconColor = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      default:
        return 'text-blue-500'
    }
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`w-6 h-6 ${getIconColor()}`} />
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={getConfirmButtonClasses()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}