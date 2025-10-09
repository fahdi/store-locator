import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'
import MapView from '../components/MapView'
import HeaderSearch from '../components/HeaderSearch'
import FiltersDropdown, { FilterState } from '../components/FiltersDropdown'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useDataService } from '../hooks/useDataService'
import { Mall } from '../types'
import toast from 'react-hot-toast'

export default function MapPage() {
  const { isAuthenticated, user, logout } = useAuth()
  const { malls, loading, error } = useDataService()
  const [filteredMalls, setFilteredMalls] = useState<Mall[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [dropdownFilters, setDropdownFilters] = useState<FilterState>({
    statusFilter: 'all',
    storeTypeFilter: '',
    mallFilter: ''
  })

  const handleFilteredResults = useCallback((filtered: Mall[]) => {
    setFilteredMalls(filtered)
  }, [])

  const handleDropdownFilters = useCallback((filters: FilterState) => {
    setDropdownFilters(filters)
  }, [])

  // Show welcome toast for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && malls.length > 0) {
      toast('📍 Welcome to BlueSky Store Locator! Explore Doha malls and stores.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      })
    }
  }, [isAuthenticated, malls.length])

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                BlueSky Store Locator
              </h1>
              {isAuthenticated && (
                <nav className="hidden md:flex space-x-4">
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

            {/* Search Section - Center */}
            <div className="flex-1 max-w-2xl mx-4">
              <HeaderSearch
                malls={malls}
                onFilteredResults={handleFilteredResults}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
                dropdownFilters={dropdownFilters}
              />
            </div>

            {/* Right Side - User Info */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center space-x-2">
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
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Filters Dropdown */}
        {showFilters && (
          <ErrorBoundary>
            <FiltersDropdown
              malls={malls}
              onFiltersChange={handleDropdownFilters}
            />
          </ErrorBoundary>
        )}

        {/* Map Section */}
        <div className="flex-1 relative overflow-hidden">
          <ErrorBoundary>
            <MapView malls={filteredMalls.length > 0 ? filteredMalls : malls} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}