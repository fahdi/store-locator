import api from './api'

export interface MallToggleResponse {
  message: string
  mall: {
    id: number
    name: string
    isOpen: boolean
  }
}

export interface StoreToggleResponse {
  message: string
  store: {
    id: number
    name: string
    isOpen: boolean
    mallId: number
  }
}

export interface StoreUpdateData {
  name?: string
  description?: string
  opening_hours?: string
  type?: string
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
}

export interface StoreUpdateResponse {
  message: string
  store: {
    id: number
    name: string
    mallId: number
    [key: string]: any
  }
}

/**
 * Mall and Store Service
 * Handles mall/store open/close operations with proper error handling
 */
export const mallService = {
  /**
   * Toggle mall status (Admin only)
   * Cascades to all stores in the mall
   */
  async toggleMall(mallId: number): Promise<MallToggleResponse> {
    try {
      const response = await api.patch<MallToggleResponse>(
        `/api/malls/${mallId}/toggle`
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient privileges: Admin access required')
      }
      if (error.response?.status === 404) {
        throw new Error('Mall not found')
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to toggle mall status')
    }
  },

  /**
   * Toggle store status (Manager only)
   * Cannot open store if parent mall is closed
   */
  async toggleStore(mallId: number, storeId: number): Promise<StoreToggleResponse> {
    try {
      const response = await api.patch<StoreToggleResponse>(
        `/api/malls/${mallId}/stores/${storeId}/toggle`
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient privileges: Manager access required')
      }
      if (error.response?.status === 404) {
        throw new Error('Store or mall not found')
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Cannot open store: parent mall is closed')
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to toggle store status')
    }
  },

  /**
   * Update store details (Store role only)
   * Can edit name, hours, description, contact info
   */
  async updateStore(mallId: number, storeId: number, data: StoreUpdateData): Promise<StoreUpdateResponse> {
    try {
      const response = await api.put<StoreUpdateResponse>(
        `/api/malls/${mallId}/stores/${storeId}`,
        data
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient privileges: Store access required')
      }
      if (error.response?.status === 404) {
        throw new Error('Store or mall not found')
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to update store details')
    }
  }
}