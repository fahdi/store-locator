// API service for BlueSky Store Locator

import axios from 'axios'
import type { AuthResponse, Mall, Store } from '../types'
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized but don't redirect
      // Let components handle the auth state gracefully
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/login', { username, password })
    return response.data
  },
}

// Mall API
export const mallAPI = {
  getAll: async (): Promise<Mall[]> => {
    const response = await api.get<Mall[]>('/api/malls')
    return response.data
  },

  // Public endpoint for unauthenticated users (still available for demo purposes)
  getAllPublic: async (): Promise<Mall[]> => {
    const response = await axios.get<Mall[]>(`${API_BASE_URL}/api/malls/public`)
    return response.data
  },

  toggleMall: async (mallId: number): Promise<Mall> => {
    const response = await api.patch<Mall>(`/api/malls/${mallId}/toggle`)
    return response.data
  },

  toggleStore: async (mallId: number, storeId: number): Promise<Store> => {
    const response = await api.patch<Store>(`/api/malls/${mallId}/stores/${storeId}/toggle`)
    return response.data
  },

  updateStore: async (mallId: number, storeId: number, updates: Partial<Store>): Promise<Store> => {
    const response = await api.put<Store>(`/api/malls/${mallId}/stores/${storeId}`, updates)
    return response.data
  },
}

// Utility API
export const utilityAPI = {
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/api/health')
    return response.data
  },

  getStores: async (): Promise<Store[]> => {
    const response = await api.get<Store[]>('/api/stores')
    return response.data
  },
}

export default api