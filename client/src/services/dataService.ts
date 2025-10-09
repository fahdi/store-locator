import { Mall, Store } from '../types'
import { mallAPI, utilityAPI } from './api'

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export class DataService {
  private static instance: DataService
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async fetchMalls(useCache = true): Promise<Mall[]> {
    const cacheKey = 'malls'
    
    if (useCache) {
      const cached = this.getCachedData<Mall[]>(cacheKey)
      if (cached) return cached
    }

    try {
      const malls = await mallAPI.getAll()
      
      // Validate response structure
      if (!Array.isArray(malls)) {
        throw new Error('Invalid response format from server')
      }
      
      this.setCachedData(cacheKey, malls)
      return malls
    } catch (error) {
      console.error('Failed to fetch malls:', error)
      
      // Handle error types
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
        throw new Error('Network error: Unable to connect to server. Please check your connection.')
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        if (axiosError.response?.status >= 500) {
          throw new Error('Server error: The server is temporarily unavailable. Please try again later.')
        }
      }
      
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('Failed to load mall data. Please try again.')
      }
    }
  }

  async fetchMallById(id: number): Promise<Mall | null> {
    try {
      const malls = await this.fetchMalls()
      return malls.find(mall => mall.id === id) || null
    } catch (error) {
      console.error('Failed to fetch mall by ID:', error)
      throw new Error('Failed to load mall details. Please try again.')
    }
  }

  async fetchStoreById(storeId: number, mallId?: number): Promise<(Store & { mallName?: string }) | null> {
    try {
      const malls = await this.fetchMalls()
      
      for (const mall of malls) {
        const store = mall.stores.find(s => s.id === storeId)
        if (store) {
          return { ...store, mallName: mall.name }
        }
      }
      
      return null
    } catch (error) {
      console.error('Failed to fetch store by ID:', error)
      throw new Error('Failed to load store details. Please try again.')
    }
  }

  async refreshData(): Promise<Mall[]> {
    this.cache.clear()
    return this.fetchMalls(false)
  }

  // Health check with detailed error reporting
  async checkServerHealth(): Promise<{ healthy: boolean; message?: string }> {
    try {
      await utilityAPI.healthCheck()
      return { healthy: true }
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
        return { 
          healthy: false, 
          message: 'Network error: Unable to connect to server' 
        }
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        return { 
          healthy: false, 
          message: `Server returned ${axiosError.response?.status}: ${axiosError.response?.statusText}` 
        }
      } else {
        return { 
          healthy: false, 
          message: 'Unknown connection error' 
        }
      }
    }
  }
}

export const dataService = DataService.getInstance()