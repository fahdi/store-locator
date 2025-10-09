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
  const [showMobileSearch, setShowMobileSearch] = useState(false)
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

            {/* Search Section - Center (Hidden on Mobile) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
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

      {/* Mobile Search Button - Floating */}
      <button
        onClick={() => setShowMobileSearch(true)}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors"
        aria-label="Open search"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
          {/* Mobile Search Header */}
          <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
          </div>

          {/* Mobile Search Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <HeaderSearch
                malls={malls}
                onFilteredResults={handleFilteredResults}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
                dropdownFilters={dropdownFilters}
                className="w-full"
              />
              
              {showFilters && (
                <ErrorBoundary>
                  <FiltersDropdown
                    malls={malls}
                    onFiltersChange={handleDropdownFilters}
                  />
                </ErrorBoundary>
              )}
            </div>
          </div>

          {/* Mobile Search Actions */}
          <div className="bg-white border-t px-4 py-3">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Apply Filters & Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}