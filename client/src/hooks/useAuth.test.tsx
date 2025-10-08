import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { useAuth } from './useAuth'
import { AuthProvider } from '../context/AuthContext'
import { STORAGE_KEYS } from '../utils/constants'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should throw error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })

  it('should initialize with no user and not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should login user and update state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    const testToken = 'test-jwt-token'
    const testUser = {
      username: 'admin',
      role: 'admin' as const,
      token: testToken
    }

    act(() => {
      result.current.login(testToken, testUser)
    })

    expect(result.current.user).toEqual(testUser)
    expect(result.current.token).toBe(testToken)
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN, testToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA, JSON.stringify(testUser))
  })

  it('should logout user and clear state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // First login
    const testToken = 'test-jwt-token'
    const testUser = {
      username: 'admin',
      role: 'admin' as const,
      token: testToken
    }

    act(() => {
      result.current.login(testToken, testUser)
    })

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA)
  })

  it('should restore authentication from localStorage', () => {
    const testToken = 'stored-jwt-token'
    const testUser = {
      username: 'manager',
      role: 'manager' as const,
      token: testToken
    }

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === STORAGE_KEYS.AUTH_TOKEN) return testToken
      if (key === STORAGE_KEYS.USER_DATA) return JSON.stringify(testUser)
      return null
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toEqual(testUser)
    expect(result.current.token).toBe(testToken)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle corrupted localStorage data gracefully', () => {
    const testToken = 'stored-jwt-token'
    const corruptedData = 'invalid-json'

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === STORAGE_KEYS.AUTH_TOKEN) return testToken
      if (key === STORAGE_KEYS.USER_DATA) return corruptedData
      return null
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA)
    
    consoleSpy.mockRestore()
  })

  it('should handle different user roles', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    const roles = ['admin', 'manager', 'store'] as const
    
    roles.forEach(role => {
      const testToken = `${role}-token`
      const testUser = {
        username: role,
        role,
        token: testToken
      }

      act(() => {
        result.current.login(testToken, testUser)
      })

      expect(result.current.user?.role).toBe(role)
      expect(result.current.isAuthenticated).toBe(true)

      act(() => {
        result.current.logout()
      })
    })
  })
})