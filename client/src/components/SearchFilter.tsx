import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X, MapPin, Clock, ChevronDown } from 'lucide-react'
import { Mall, Store } from '../types'

interface SearchFilterProps {
  malls: Mall[]
  onFilteredResults: (filteredMalls: Mall[]) => void
  className?: string
}

interface FilterState {
  searchQuery: string
  statusFilter: 'all' | 'open' | 'closed'
  storeTypeFilter: string
  mallFilter: string
  showAdvanced: boolean
}

export default function SearchFilter({ malls, onFilteredResults, className = '' }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: 'all',
    storeTypeFilter: '',
    mallFilter: '',
    showAdvanced: false
  })

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(true)

  // Get unique store types and mall names for filter options
  const storeTypes = Array.from(new Set(
    malls.flatMap(mall => mall.stores.map(store => store.type))
  )).sort()

  const mallNames = malls.map(mall => mall.name).sort()

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filteredMalls = [...malls]

    // Search query filter (searches mall names, store names, and store types)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filteredMalls = filteredMalls.map(mall => ({
        ...mall,
        stores: mall.stores.filter(store =>
          store.name.toLowerCase().includes(query) ||
          store.type.toLowerCase().includes(query) ||
          mall.name.toLowerCase().includes(query)
        )
      })).filter(mall => 
        mall.name.toLowerCase().includes(query) || 
        mall.stores.length > 0
      )
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      const isOpenFilter = filters.statusFilter === 'open'
      filteredMalls = filteredMalls.map(mall => ({
        ...mall,
        stores: mall.stores.filter(store => store.isOpen === isOpenFilter)
      })).filter(mall => mall.stores.length > 0 || mall.isOpen === isOpenFilter)
    }

    // Store type filter
    if (filters.storeTypeFilter) {
      filteredMalls = filteredMalls.map(mall => ({
        ...mall,
        stores: mall.stores.filter(store => store.type === filters.storeTypeFilter)
      })).filter(mall => mall.stores.length > 0)
    }

    // Mall filter
    if (filters.mallFilter) {
      filteredMalls = filteredMalls.filter(mall => mall.name === filters.mallFilter)
    }

    onFilteredResults(filteredMalls)
  }, [filters, malls, onFilteredResults])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: event.target.value }))
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'all',
      storeTypeFilter: '',
      mallFilter: '',
      showAdvanced: false
    })
    setIsFilterMenuOpen(false)
  }

  const hasActiveFilters = filters.searchQuery || 
    filters.statusFilter !== 'all' || 
    filters.storeTypeFilter || 
    filters.mallFilter

  const getResultsCount = () => {
    // Count filtered results
    let totalStores = 0
    let totalMalls = 0
    
    if (filters.searchQuery || filters.statusFilter !== 'all' || filters.storeTypeFilter || filters.mallFilter) {
      // Apply same filtering logic to count results
      let filteredMalls = [...malls]

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredMalls = filteredMalls.map(mall => ({
          ...mall,
          stores: mall.stores.filter(store =>
            store.name.toLowerCase().includes(query) ||
            store.type.toLowerCase().includes(query) ||
            mall.name.toLowerCase().includes(query)
          )
        })).filter(mall => 
          mall.name.toLowerCase().includes(query) || 
          mall.stores.length > 0
        )
      }

      if (filters.statusFilter !== 'all') {
        const isOpenFilter = filters.statusFilter === 'open'
        filteredMalls = filteredMalls.map(mall => ({
          ...mall,
          stores: mall.stores.filter(store => store.isOpen === isOpenFilter)
        })).filter(mall => mall.stores.length > 0 || mall.isOpen === isOpenFilter)
      }

      if (filters.storeTypeFilter) {
        filteredMalls = filteredMalls.map(mall => ({
          ...mall,
          stores: mall.stores.filter(store => store.type === filters.storeTypeFilter)
        })).filter(mall => mall.stores.length > 0)
      }

      if (filters.mallFilter) {
        filteredMalls = filteredMalls.filter(mall => mall.name === filters.mallFilter)
      }

      totalMalls = filteredMalls.length
      totalStores = filteredMalls.reduce((sum, mall) => sum + mall.stores.length, 0)
    } else {
      totalMalls = malls.length
      totalStores = malls.reduce((sum, mall) => sum + mall.stores.length, 0)
    }

    return { totalMalls, totalStores }
  }

  const { totalMalls, totalStores } = getResultsCount()

  return (
    <div className={`bg-white rounded-lg shadow-md border ${className}`}>
      {/* Mobile Search Toggle */}
      <div className="sm:hidden p-3 border-b bg-gray-50">
        <button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="w-full flex items-center justify-between py-2 px-3 bg-white border rounded-lg text-sm font-medium text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search & Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {[filters.searchQuery, filters.statusFilter !== 'all', filters.storeTypeFilter, filters.mallFilter].filter(Boolean).length}
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isSearchVisible ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Search Bar */}
      <div className={`p-4 ${!isSearchVisible ? 'hidden sm:block' : ''}`}>
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search malls, stores, or categories..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleFilterChange('searchQuery', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              hasActiveFilters
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {[filters.statusFilter !== 'all', filters.storeTypeFilter, filters.mallFilter].filter(Boolean).length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Results Summary */}
        {(hasActiveFilters || filters.searchQuery) && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>
              Found {totalMalls} mall{totalMalls !== 1 ? 's' : ''} with {totalStores} store{totalStores !== 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isFilterMenuOpen && (
        <div className={`border-t bg-gray-50 p-4 ${!isSearchVisible ? 'hidden sm:block' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Status
              </label>
              <select
                value={filters.statusFilter}
                onChange={(e) => handleFilterChange('statusFilter', e.target.value as 'all' | 'open' | 'closed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Locations</option>
                <option value="open">Open Only</option>
                <option value="closed">Closed Only</option>
              </select>
            </div>

            {/* Store Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Category
              </label>
              <select
                value={filters.storeTypeFilter}
                onChange={(e) => handleFilterChange('storeTypeFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Categories</option>
                {storeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Mall Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Mall Location
              </label>
              <select
                value={filters.mallFilter}
                onChange={(e) => handleFilterChange('mallFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Malls</option>
                {mallNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}