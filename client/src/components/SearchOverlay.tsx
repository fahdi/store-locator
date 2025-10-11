import { useState, useEffect } from 'react'
import { Search, Filter, X, MapPin, Store } from 'lucide-react'
import { Mall, Store as StoreType } from '../types'

interface SearchOverlayProps {
  malls: Mall[]
  onMallSelect: (mall: Mall) => void
  onStoreSelect: (store: StoreType, mallName: string, mallId: number) => void
  onFilterChange: (filters: SearchFilters) => void
}

export interface SearchFilters {
  searchTerm: string
  showMalls: boolean
  showStores: boolean
  showOpen: boolean
  showClosed: boolean
  storeType: string
}

export default function SearchOverlay({ 
  malls, 
  onMallSelect, 
  onStoreSelect, 
  onFilterChange 
}: SearchOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    showMalls: true,
    showStores: true,
    showOpen: true,
    showClosed: true,
    storeType: 'all'
  })

  // Get unique store types
  const storeTypes = ['all', ...new Set(
    malls.flatMap(mall => mall.stores.map(store => store.type))
  )].sort()

  // Filter malls and stores based on search criteria
  const filteredResults = malls.flatMap(mall => {
    const results: Array<{
      type: 'mall' | 'store'
      item: Mall | (StoreType & { mallName: string; mallId: number })
      matchScore: number
    }> = []

    // Check if mall matches search
    const mallMatches = !filters.searchTerm || 
      mall.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    
    if (mallMatches && filters.showMalls) {
      const statusMatch = (mall.isOpen && filters.showOpen) || (!mall.isOpen && filters.showClosed)
      if (statusMatch) {
        results.push({
          type: 'mall',
          item: mall,
          matchScore: mall.name.toLowerCase().indexOf(filters.searchTerm.toLowerCase())
        })
      }
    }

    // Check stores
    if (filters.showStores) {
      mall.stores.forEach(store => {
        const storeMatches = !filters.searchTerm || 
          store.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          store.type.toLowerCase().includes(filters.searchTerm.toLowerCase())
        
        const statusMatch = (store.isOpen && filters.showOpen) || (!store.isOpen && filters.showClosed)
        const typeMatch = filters.storeType === 'all' || store.type === filters.storeType
        
        if (storeMatches && statusMatch && typeMatch) {
          results.push({
            type: 'store',
            item: { ...store, mallName: mall.name, mallId: mall.id },
            matchScore: store.name.toLowerCase().indexOf(filters.searchTerm.toLowerCase())
          })
        }
      })
    }

    return results
  }).sort((a, b) => {
    // Sort by match score (exact matches first), then alphabetically
    if (a.matchScore !== b.matchScore) {
      return a.matchScore - b.matchScore
    }
    const aName = a.type === 'mall' ? (a.item as Mall).name : (a.item as StoreType).name
    const bName = b.type === 'mall' ? (b.item as Mall).name : (b.item as StoreType).name
    return aName.localeCompare(bName)
  })

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, searchTerm: '' }))
  }

  const handleResultClick = (result: typeof filteredResults[0]) => {
    if (result.type === 'mall') {
      onMallSelect(result.item as Mall)
    } else {
      const store = result.item as StoreType & { mallName: string; mallId: number }
      onStoreSelect(store, store.mallName, store.mallId)
    }
    setIsExpanded(false)
  }

  return (
    <>
      {/* Mobile Full Screen Overlay */}
      <div className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col transition-transform duration-300 ${
        isExpanded ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Input with Filters Button */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-gray-50 rounded-lg p-3">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search malls and stores..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
                />
                {filters.searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="p-4 space-y-6">
            {/* Status Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                </div>
                <label className="text-sm font-medium text-gray-900">Status</label>
              </div>
              <select
                value={
                  filters.showOpen && filters.showClosed ? 'all' :
                  filters.showOpen ? 'open' :
                  filters.showClosed ? 'closed' : 'none'
                }
                onChange={(e) => {
                  const value = e.target.value
                  if (value === 'all') {
                    updateFilters({ showOpen: true, showClosed: true })
                  } else if (value === 'open') {
                    updateFilters({ showOpen: true, showClosed: false })
                  } else if (value === 'closed') {
                    updateFilters({ showOpen: false, showClosed: true })
                  }
                }}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-3 bg-white text-gray-600"
              >
                <option value="all">All Locations</option>
                <option value="open">Open Only</option>
                <option value="closed">Closed Only</option>
              </select>
            </div>

            {/* Store Type Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Store className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-900">Store Type</label>
              </div>
              <select
                value={filters.storeType}
                onChange={(e) => updateFilters({ storeType: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-3 bg-white text-gray-600"
              >
                {storeTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Show/Hide Toggle */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-900">Show on Map</label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Malls</span>
                  <input
                    type="checkbox"
                    checked={filters.showMalls}
                    onChange={(e) => updateFilters({ showMalls: e.target.checked })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Stores</span>
                  <input
                    type="checkbox"
                    checked={filters.showStores}
                    onChange={(e) => updateFilters({ showStores: e.target.checked })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Search Results */}
          {(filters.searchTerm || filteredResults.length > 0) && (
            <div className="border-t border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Search Results</h3>
                {filteredResults.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8">
                    No results found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredResults.slice(0, 10).map((result) => {
                      const isStore = result.type === 'store'
                      const item = result.item
                      const name = isStore ? (item as StoreType).name : (item as Mall).name
                      const isOpen = isStore ? (item as StoreType).isOpen : (item as Mall).isOpen
                      const mallName = isStore ? (item as StoreType & { mallName: string }).mallName : undefined
                      const storeType = isStore ? (item as StoreType).type : undefined

                      return (
                        <button
                          key={`${result.type}-${isStore ? (item as StoreType).id : (item as Mall).id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <div className="flex-shrink-0">
                            {isStore ? (
                              <Store className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-red-600'}`} />
                            ) : (
                              <MapPin className={`w-5 h-5 ${isOpen ? 'text-green-600' : 'text-red-600'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {isStore ? (
                                <>
                                  {storeType} • {mallName}
                                </>
                              ) : (
                                `${(item as Mall).stores.length} store${(item as Mall).stores.length !== 1 ? 's' : ''}`
                              )}
                            </div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            isOpen 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {isOpen ? 'Open' : 'Closed'}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Stats */}
          <div className="border-t border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Malls:</span>
                <span className="font-medium">{malls.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Stores:</span>
                <span className="font-medium">{malls.reduce((sum, mall) => sum + mall.stores.length, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Open Now:</span>
                <span className="font-medium text-green-600">
                  {malls.filter(m => m.isOpen).length + malls.reduce((sum, mall) => sum + mall.stores.filter(s => s.isOpen).length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Overlay */}
      <div className="hidden md:block absolute top-4 left-4 z-[1000] max-w-sm">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-2">
        <div className="flex items-center p-3">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search malls and stores..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 border-none outline-none text-sm placeholder-gray-400"
          />
          {filters.searchTerm && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`ml-2 p-1 rounded ${isExpanded ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-3 space-y-3">
            {/* Show/Hide Options */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">Show</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showMalls}
                    onChange={(e) => updateFilters({ showMalls: e.target.checked })}
                    className="mr-1"
                  />
                  Malls
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showStores}
                    onChange={(e) => updateFilters({ showStores: e.target.checked })}
                    className="mr-1"
                  />
                  Stores
                </label>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showOpen}
                    onChange={(e) => updateFilters({ showOpen: e.target.checked })}
                    className="mr-1"
                  />
                  <span className="text-green-600">Open</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showClosed}
                    onChange={(e) => updateFilters({ showClosed: e.target.checked })}
                    className="mr-1"
                  />
                  <span className="text-red-600">Closed</span>
                </label>
              </div>
            </div>

            {/* Store Type Filter */}
            {filters.showStores && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Store Type</label>
                <select
                  value={filters.storeType}
                  onChange={(e) => updateFilters({ storeType: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                >
                  {storeTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {(filters.searchTerm || isExpanded) && (
          <div className="border-t border-gray-200 max-h-64 overflow-y-auto">
            {filteredResults.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                No results found
              </div>
            ) : (
              <div className="py-1">
                {filteredResults.slice(0, 10).map((result) => {
                  const isStore = result.type === 'store'
                  const item = result.item
                  const name = isStore ? (item as StoreType).name : (item as Mall).name
                  const isOpen = isStore ? (item as StoreType).isOpen : (item as Mall).isOpen
                  const mallName = isStore ? (item as StoreType & { mallName: string }).mallName : undefined
                  const storeType = isStore ? (item as StoreType).type : undefined

                  return (
                    <button
                      key={`${result.type}-${isStore ? (item as StoreType).id : (item as Mall).id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <div className="flex-shrink-0">
                        {isStore ? (
                          <Store className={`w-4 h-4 ${isOpen ? 'text-blue-600' : 'text-red-600'}`} />
                        ) : (
                          <MapPin className={`w-4 h-4 ${isOpen ? 'text-green-600' : 'text-red-600'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {isStore ? (
                            <>
                              {storeType} • {mallName}
                            </>
                          ) : (
                            `${(item as Mall).stores.length} store${(item as Mall).stores.length !== 1 ? 's' : ''}`
                          )}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isOpen ? 'Open' : 'Closed'}
                      </div>
                    </button>
                  )
                })}
                {filteredResults.length > 10 && (
                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50">
                    Showing first 10 of {filteredResults.length} results
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

        {/* Desktop Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Total Malls:</span>
              <span className="font-medium">{malls.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Stores:</span>
              <span className="font-medium">{malls.reduce((sum, mall) => sum + mall.stores.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Open Now:</span>
              <span className="font-medium text-green-600">
                {malls.filter(m => m.isOpen).length + malls.reduce((sum, mall) => sum + mall.stores.filter(s => s.isOpen).length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Trigger Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Search className="w-6 h-6" />
      </button>
    </>
  )
}