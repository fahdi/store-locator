import { useAuth } from '../hooks/useAuth'
import { Navigate, Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'manager':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'store':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleCapabilities = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          'Toggle entire malls open/close',
          'View all malls and stores',
          'Access admin dashboard',
          'Cascading control over all stores'
        ]
      case 'manager':
        return [
          'Toggle individual stores open/close',
          'View all stores in assigned malls',
          'Cannot open stores if mall is closed',
          'Manage store operations'
        ]
      case 'store':
        return [
          'Edit store details (name, hours, description)',
          'View own store information',
          'Update contact information',
          'Manage store content'
        ]
      default:
        return []
    }
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
              <nav className="flex space-x-4">
                <Link 
                  to={ROUTES.DASHBOARD}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  to={ROUTES.MALLS}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
                >
                  🗺️ Map
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome,</span>
                <span className="font-medium text-gray-900">{user?.username}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user?.role || '')}`}>
                  {user?.role}
                </span>
              </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                You are logged in as <strong>{user?.role}</strong> with access to the following capabilities:
              </p>
              
              <div className="space-y-3">
                {getRoleCapabilities(user?.role || '').map((capability, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">🗺️ Map Available Now!</h3>
                <p className="text-green-700 text-sm mb-3">
                  The interactive map with Doha mall locations is now live. View mall markers with status indicators.
                </p>
                <Link 
                  to={ROUTES.MALLS}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition duration-200"
                >
                  🗺️ View Map
                </Link>
              </div>
            </div>
          </div>

          {/* Role Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Role Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900">{user?.username}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(user?.role || '')}`}>
                    {user?.role}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Authentication Status</label>
                  <p className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Authenticated
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition duration-200">
                    View Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition duration-200">
                    Change Password
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Development Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-900">Phase 1: Foundation</p>
                <p className="text-xs text-green-700">Complete ✅</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-900">Phase 2: Authentication</p>
                <p className="text-xs text-green-700">Complete ✅</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">Phase 3: Map Integration</p>
                <p className="text-xs text-blue-700">70% Complete 🔄</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}