// Core data types for BlueSky Store Locator

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Store {
  id: number
  name: string
  type: string
  mallId?: number
  coordinates?: Coordinates
  opening_hours: string
  isOpen: boolean
  description?: string
  image?: string
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
}

export interface Mall {
  id: number
  name: string
  location?: string
  coordinates: Coordinates
  isOpen: boolean
  image?: string
  description?: string
  opening_hours?: string
  stores: Store[]
}

export interface User {
  username: string
  role: 'admin' | 'manager' | 'store'
  token: string
}

export interface AuthResponse {
  token: string
  username: string
  role: 'admin' | 'manager' | 'store'
}

export interface APIError {
  error: string
  details?: string
}

export interface LoginCredentials {
  username: string
  password: string
}