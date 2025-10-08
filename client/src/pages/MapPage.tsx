import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { mallAPI } from '../services/api'
import { Mall } from '../types'
import { ROUTES } from '../utils/constants'
import MapView from '../components/MapView'

export default function MapPage() {
  const { isAuthenticated, user, logout } = useAuth()
  const [malls, setMalls] = useState<Mall[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMalls = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Use public endpoint if not authenticated, authenticated endpoint if logged in
      const mallsData = isAuthenticated 
        ? await mallAPI.getAll()
        : await mallAPI.getAllPublic()
      setMalls(mallsData)
    } catch (err) {
      console.error('Failed to fetch malls:', err)
      setError('Failed to load map data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMalls()
  }, [])

  const handleRetry = () => {
    fetchMalls()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  BlueSky Store Locator
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={logout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  BlueSky Store Locator
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={logout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Error State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Map</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                BlueSky Store Locator
              </h1>
              {isAuthenticated && (
                <nav className="flex space-x-4">
                  <span className="text-blue-600 font-medium px-3 py-2 text-sm">
                    🗺️ Map
                  </span>
                  <a 
                    href={ROUTES.DASHBOARD}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
                  >
                    Dashboard
                  </a>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Welcome,</span>
                    <span className="font-medium text-gray-900">{user?.username}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      user?.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' :
                      user?.role === 'manager' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href={ROUTES.LOGIN}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-200"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <main className="h-[calc(100vh-4rem)]">
        {!isAuthenticated && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-blue-800">
                📍 <strong>Public Store Locator</strong> - Explore Doha mall locations and store information. 
                <a href={ROUTES.LOGIN} className="underline hover:no-underline ml-2">
                  Login for management features
                </a>
              </p>
            </div>
          </div>
        )}
        <div className={!isAuthenticated ? "h-[calc(100vh-7rem)]" : "h-[calc(100vh-4rem)]"}>
          <MapView malls={malls} />
        </div>
      </main>
    </div>
  )
}