import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Mall, Store } from '../types'
import { FilterState } from './FiltersDropdown'

interface HeaderSearchProps {
  malls: Mall[]
  onFilteredResults: (filteredMalls: Mall[]) => void
  onToggleFilters: () => void
  showFilters: boolean
  dropdownFilters?: FilterState
  className?: string
}

interface LocalFilterState extends FilterState {
  searchQuery: string
}

export default function HeaderSearch({ 
  malls, 
  onFilteredResults, 
  onToggleFilters, 
  showFilters,
  dropdownFilters,
  className = '' 
}: HeaderSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Merge search query with dropdown filters
  const effectiveFilters = {
    searchQuery,
    statusFilter: dropdownFilters?.statusFilter || 'all',
    storeTypeFilter: dropdownFilters?.storeTypeFilter || '',
    mallFilter: dropdownFilters?.mallFilter || ''
  }

  // Filter logic
  const filterResults = useCallback(() => {
    let filteredMalls = malls.filter(mall => {
      // Mall name filter
      if (effectiveFilters.mallFilter && mall.id !== parseInt(effectiveFilters.mallFilter)) {
        return false
      }

      // Search query filter (searches mall names and store names)
      if (effectiveFilters.searchQuery) {
        const query = effectiveFilters.searchQuery.toLowerCase()
        const mallMatches = mall.name.toLowerCase().includes(query)
        const storeMatches = mall.stores.some(store => 
          store.name.toLowerCase().includes(query) ||
          store.type.toLowerCase().includes(query)
        )
        if (!mallMatches && !storeMatches) {
          return false
        }
      }

      // Filter stores within the mall
      const filteredStores = mall.stores.filter(store => {
        // Status filter
        if (effectiveFilters.statusFilter === 'open' && !store.isOpen) return false
        if (effectiveFilters.statusFilter === 'closed' && store.isOpen) return false

        // Store type filter
        if (effectiveFilters.storeTypeFilter && store.type !== effectiveFilters.storeTypeFilter) return false

        // Search query filter for stores
        if (effectiveFilters.searchQuery) {
          const query = effectiveFilters.searchQuery.toLowerCase()
          return store.name.toLowerCase().includes(query) ||
                 store.type.toLowerCase().includes(query)
        }

        return true
      })

      // Include mall if it matches search or has matching stores
      if (effectiveFilters.searchQuery) {
        const query = effectiveFilters.searchQuery.toLowerCase()
        const mallMatches = mall.name.toLowerCase().includes(query)
        return mallMatches || filteredStores.length > 0
      }

      return true
    })

    // Apply store filters to each mall
    filteredMalls = filteredMalls.map(mall => ({
      ...mall,
      stores: mall.stores.filter(store => {
        if (effectiveFilters.statusFilter === 'open' && !store.isOpen) return false
        if (effectiveFilters.statusFilter === 'closed' && store.isOpen) return false
        if (effectiveFilters.storeTypeFilter && store.type !== effectiveFilters.storeTypeFilter) return false
        
        if (effectiveFilters.searchQuery) {
          const query = effectiveFilters.searchQuery.toLowerCase()
          return store.name.toLowerCase().includes(query) ||
                 store.type.toLowerCase().includes(query)
        }
        
        return true
      })
    }))

    onFilteredResults(filteredMalls)
  }, [malls, effectiveFilters, onFilteredResults])

  // Apply filters whenever they change
  useEffect(() => {
    filterResults()
  }, [filterResults])

  const clearSearch = () => {
    setSearchQuery('')
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    // Note: Dropdown filters are managed by the FiltersDropdown component
  }

  const hasActiveFilters = effectiveFilters.statusFilter !== 'all' || 
                          effectiveFilters.storeTypeFilter !== '' || 
                          effectiveFilters.mallFilter !== ''

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search malls and stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={onToggleFilters}
        className={`relative flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
          showFilters 
            ? 'bg-blue-50 border-blue-300 text-blue-700' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
        )}
      </button>

      {/* Clear All Button (when filters are active) */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          Clear all
        </button>
      )}
    </div>
  )
}