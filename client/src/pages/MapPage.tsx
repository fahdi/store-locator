import { useState } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useDataService } from '../hooks/useDataService'
import { useAuth } from '../hooks/useAuth'
import MapView from '../components/MapView'
import Header from '../components/Header'

export default function MapPage() {
  const { malls } = useDataService()
  const { user } = useAuth()
  const [showRoleHint, setShowRoleHint] = useState(true)

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header - No search component */}
      <Header currentPage="map" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Map Section with integrated SearchOverlay */}
        <div className="flex-1 relative overflow-hidden">
          <ErrorBoundary>
            <MapView malls={malls} />
          </ErrorBoundary>
          
          {/* Role-based hints overlay */}
          {user && showRoleHint && (
            <div className="absolute top-4 right-4 z-[1000] max-w-xs">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-gray-700">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Mode
                  </div>
                  <button
                    onClick={() => setShowRoleHint(false)}
                    className="text-gray-400 hover:text-gray-600 ml-2 p-0.5 rounded hover:bg-gray-100 transition-colors"
                    aria-label="Close hint"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-gray-600">
                  {user.role === 'admin' && 'Click malls to toggle open/close status'}
                  {user.role === 'manager' && 'Click stores to toggle open/close status'}
                  {user.role === 'store' && 'Click stores to edit details'}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}