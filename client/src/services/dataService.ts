import { Mall, Store } from '../types'

const API_BASE_URL = 'http://localhost:5001/api'

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

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('token')
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
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
      const response = await this.fetchWithAuth(`${API_BASE_URL}/malls`)
      const malls: Mall[] = await response.json()
      
      this.setCachedData(cacheKey, malls)
      return malls
    } catch (error) {
      console.error('Failed to fetch malls:', error)
      throw new Error('Failed to load mall data. Please try again.')
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

  // Health check
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

export const dataService = DataService.getInstance()