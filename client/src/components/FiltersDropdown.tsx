import { useState, useEffect } from 'react'
import { MapPin, Clock, Store } from 'lucide-react'
import { Mall } from '../types'

interface FiltersDropdownProps {
  malls: Mall[]
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

export interface FilterState {
  statusFilter: 'all' | 'open' | 'closed'
  storeTypeFilter: string
  mallFilter: string
}

export default function FiltersDropdown({ malls, onFiltersChange, className = '' }: FiltersDropdownProps) {
  const [filters, setFilters] = useState<FilterState>({
    statusFilter: 'all',
    storeTypeFilter: '',
    mallFilter: ''
  })

  // Get unique store types and mall names for filter options
  const storeTypes = Array.from(new Set(
    malls.flatMap(mall => mall.stores.map(store => store.type))
  )).sort()

  const mallNames = malls.map(mall => ({ id: mall.id, name: mall.name }))

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className={`bg-white ${className?.includes('mobile-filters') ? 'mobile-filters-container' : 'border-b border-gray-200 shadow-sm'} ${className}`}>
      <div className={`${className?.includes('mobile-filters') ? 'px-0 py-0' : 'max-w-7xl mx-auto px-4 py-4'}`}>
        <div className={`grid gap-4 ${className?.includes('mobile-filters') ? 'grid-cols-1 space-y-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              <Clock className="inline h-3 w-3 mr-1" />
              Status
            </label>
            <select
              value={filters.statusFilter}
              onChange={(e) => updateFilter('statusFilter', e.target.value)}
              className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] touch-manipulation"
            >
              <option value="all">All Locations</option>
              <option value="open">Open Now</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Store Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              <Store className="inline h-3 w-3 mr-1" />
              Store Type
            </label>
            <select
              value={filters.storeTypeFilter}
              onChange={(e) => updateFilter('storeTypeFilter', e.target.value)}
              className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] touch-manipulation"
            >
              <option value="">All Types</option>
              {storeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Mall Filter */}
          <div className={className?.includes('mobile-filters') ? 'mobile-mall-filter' : ''}>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              <MapPin className="inline h-3 w-3 mr-1" />
              Mall Location
            </label>
            <select
              value={filters.mallFilter}
              onChange={(e) => updateFilter('mallFilter', e.target.value)}
              className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] touch-manipulation"
            >
              <option value="">All Malls</option>
              {mallNames.map(mall => (
                <option key={mall.id} value={mall.id.toString()}>{mall.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Showing {malls.length} malls • {malls.reduce((total, mall) => total + mall.stores.length, 0)} stores total
          </p>
        </div>
      </div>
    </div>
  )
}