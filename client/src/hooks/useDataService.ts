import { useState, useEffect, useCallback } from 'react'
import { dataService } from '../services/dataService'
import { Mall, Store } from '../types'

interface UseDataServiceResult {
  malls: Mall[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  clearError: () => void
}

export function useDataService(): UseDataServiceResult {
  const [malls, setMalls] = useState<Mall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const mallsData = forceRefresh 
        ? await dataService.refreshData()
        : await dataService.fetchMalls()
      
      setMalls(mallsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      console.error('Data service error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    malls,
    loading,
    error,
    refreshData,
    clearError
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