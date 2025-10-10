// Constants for BlueSky Store Locator

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.PROD ? '' : 'http://localhost:5001'
)

export const DOHA_CENTER = {
  latitude: 25.2854,
  longitude: 51.5310,
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  STORE: 'store',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MALLS: '/malls',
  STORES: '/stores',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'bluesky_auth_token',
  USER_DATA: 'bluesky_user_data',
} as const