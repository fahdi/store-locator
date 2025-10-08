import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'
import MapView from '../components/MapView'
import SearchFilter from '../components/SearchFilter'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useDataService } from '../hooks/useDataService'
import { Mall } from '../types'

export default function MapPage() {
  const { isAuthenticated, user, logout } = useAuth()
  const { malls, loading, error } = useDataService()
  const [filteredMalls, setFilteredMalls] = useState<Mall[]>([])

  const handleFilteredResults = (filtered: Mall[]) => {
    setFilteredMalls(filtered)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                BlueSky Store Locator
              </h1>
              {isAuthenticated && (
                <nav className="flex space-x-4">
                  <span className="text-blue-600 font-medium px-3 py-2 text-sm">
                    🗺️ Map
                  </span>
                  <a 
                    href={ROUTES.DASHBOARD}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
                  >
                    Dashboard
                  </a>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Welcome,</span>
                    <span className="font-medium text-gray-900">{user?.username}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      user?.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' :
                      user?.role === 'manager' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href={ROUTES.LOGIN}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-200"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {!isAuthenticated && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-blue-800">
                📍 <strong>Public Store Locator</strong> - Explore Doha mall locations and store information. 
                <a href={ROUTES.LOGIN} className="underline hover:no-underline ml-2">
                  Login for management features
                </a>
              </p>
            </div>
          </div>
        )}
        
        {/* Search and Filter Section */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              <SearchFilter
                malls={malls}
                onFilteredResults={handleFilteredResults}
                className="shadow-sm"
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Map Section */}
        <div className="flex-1 relative">
          <ErrorBoundary>
            <MapView malls={filteredMalls.length > 0 ? filteredMalls : malls} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}