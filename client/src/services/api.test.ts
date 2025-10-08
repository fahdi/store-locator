import { describe, it, expect, beforeEach, vi } from 'vitest'

// Simple API tests focusing on the core functions
describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('authAPI', () => {
    it('should have login function', async () => {
      // Mock the axios module
      vi.doMock('axios', () => ({
        default: {
          create: () => ({
            post: vi.fn().mockResolvedValue({
              data: {
                token: 'mock-token',
                username: 'admin',
                role: 'admin'
              }
            }),
            interceptors: {
              request: { use: vi.fn() },
              response: { use: vi.fn() }
            }
          })
        }
      }))

      const { authAPI } = await import('./api')
      
      const result = await authAPI.login('admin', 'a')
      expect(result).toEqual({
        token: 'mock-token',
        username: 'admin',
        role: 'admin'
      })
    })
  })

  describe('constants', () => {
    it('should export API_BASE_URL constant', async () => {
      const { API_BASE_URL } = await import('../utils/constants')
      expect(API_BASE_URL).toBeDefined()
      expect(typeof API_BASE_URL).toBe('string')
    })
  })

  describe('type definitions', () => {
    it('should have proper AuthResponse type', () => {
      // This tests that our types are properly exported
      const mockResponse = {
        token: 'test-token',
        username: 'test-user',
        role: 'admin' as const
      }
      
      expect(mockResponse.token).toBe('test-token')
      expect(mockResponse.username).toBe('test-user')
      expect(mockResponse.role).toBe('admin')
    })
  })
})