import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { dataService } from '../services/dataService'
import { Mall, Store } from '../types'

interface UseDataServiceResult {
  malls: Mall[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  clearError: () => void
  retryCount: number
}

export function useDataService(): UseDataServiceResult {
  const [malls, setMalls] = useState<Mall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchData = useCallback(async (forceRefresh = false, showToasts = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const mallsData = forceRefresh 
        ? await dataService.refreshData()
        : await dataService.fetchMalls()
      
      setMalls(mallsData)
      setRetryCount(0) // Reset retry count on success
      
      if (showToasts && forceRefresh) {
        toast.success('Data refreshed successfully')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      setRetryCount(prev => prev + 1)
      console.error('Data service error:', err)
      
      if (showToasts) {
        toast.error(errorMessage)
      }
      
      // Auto-retry up to 2 times with exponential backoff
      if (retryCount < 2 && !forceRefresh) {
        const retryDelay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
        setTimeout(() => {
          console.log(`Auto-retrying data fetch (attempt ${retryCount + 1})`)
          fetchData(false, false)
        }, retryDelay)
      }
    } finally {
      setLoading(false)
    }
  }, [retryCount])

  const refreshData = useCallback(async () => {
    await fetchData(true, true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    malls,
    loading,
    error,
    refreshData,
    clearError,
    retryCount
  }
}

interface UseMallResult {
  mall: Mall | null
  loading: boolean
  error: string | null
}

export function useMall(mallId: number): UseMallResult {
  const [mall, setMall] = useState<Mall | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMall = async () => {
      try {
        setLoading(true)
        setError(null)
        const mallData = await dataService.fetchMallById(mallId)
        setMall(mallData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load mall'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchMall()
  }, [mallId])

  return { mall, loading, error }
}

interface UseStoreResult {
  store: (Store & { mallName?: string }) | null
  loading: boolean
  error: string | null
}

export function useStore(storeId: number, mallId?: number): UseStoreResult {
  const [store, setStore] = useState<(Store & { mallName?: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true)
        setError(null)
        const storeData = await dataService.fetchStoreById(storeId, mallId)
        setStore(storeData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load store'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchStore()
  }, [storeId, mallId])

  return { store, loading, error }
}