import { useState, useEffect, useCallback, useRef } from 'react'
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
  const retryTimeoutRef = useRef<any>(null)
  const mountedRef = useRef(true)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchData = useCallback(async (forceRefresh = false, showToasts = false) => {
    if (!mountedRef.current) return

    try {
      setLoading(true)
      setError(null)
      
      // Clear any pending retry
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      
      const mallsData = forceRefresh 
        ? await dataService.refreshData()
        : await dataService.fetchMalls()
      
      if (!mountedRef.current) return
      
      setMalls(mallsData)
      setRetryCount(0)
      
      if (showToasts && forceRefresh) {
        toast.success('Data refreshed successfully')
      }
    } catch (err) {
      if (!mountedRef.current) return
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      console.error('Data service error:', err)
      
      if (showToasts) {
        toast.error(errorMessage)
      }
      
      // Auto-retry up to 2 times with exponential backoff
      setRetryCount(prev => {
        const newRetryCount = prev + 1
        if (newRetryCount <= 2 && !forceRefresh && mountedRef.current) {
          const retryDelay = Math.pow(2, prev) * 1000 // 1s, 2s, 4s
          retryTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              console.log(`Auto-retrying data fetch (attempt ${newRetryCount})`)
              fetchData(false, false)
            }
          }, retryDelay)
        }
        return newRetryCount
      })
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const refreshData = useCallback(async () => {
    await fetchData(true, true)
  }, [fetchData])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    
    return () => {
      mountedRef.current = false
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
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