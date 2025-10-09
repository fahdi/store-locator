import { useState, useCallback } from 'react'
import MapView from '../components/MapView'
import HeaderSearch from '../components/HeaderSearch'
import FiltersDropdown, { FilterState } from '../components/FiltersDropdown'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useDataService } from '../hooks/useDataService'
import { Mall } from '../types'
import Header from '../components/Header'

export default function MapPage() {
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


  const searchComponent = (
    <HeaderSearch
      malls={malls}
      onFilteredResults={handleFilteredResults}
      onToggleFilters={() => setShowFilters(!showFilters)}
      showFilters={showFilters}
      dropdownFilters={dropdownFilters}
    />
  )

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header */}
      <Header 
        currentPage="map" 
        showSearch={true} 
        searchComponent={searchComponent}
      />

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
        onClick={() => {
          setShowMobileSearch(true)
          setShowFilters(true) // Automatically show filters on mobile
        }}
        className="block md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-[9999] transition-colors"
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
          <div className="bg-white border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setShowMobileSearch(false)
                setShowFilters(false) // Reset filters when closing mobile search
              }}
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
          <div className="flex-1 overflow-y-auto min-h-0 mobile-search-content">
            <div className="p-4 space-y-6 pb-40">
              {/* Search Input - Always visible */}
              <div className="space-y-3">
                <HeaderSearch
                  malls={malls}
                  onFilteredResults={handleFilteredResults}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  showFilters={showFilters}
                  dropdownFilters={dropdownFilters}
                  className="w-full"
                />
              </div>
              
              {/* Filters - Always show on mobile overlay */}
              <div className="space-y-4">
                <ErrorBoundary>
                  <FiltersDropdown
                    malls={malls}
                    onFiltersChange={handleDropdownFilters}
                    className="mobile-filters"
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Mobile Search Actions - Fixed at bottom */}
          <div className="bg-white border-t px-4 py-8 flex-shrink-0 safe-area-padding-bottom">
            <button
              onClick={() => {
                setShowMobileSearch(false)
                setShowFilters(false) // Reset filters when closing mobile search
              }}
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