import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'

interface HeaderProps {
  currentPage: 'dashboard' | 'map'
  showSearch?: boolean
  searchComponent?: React.ReactNode
}

export default function Header({ currentPage, showSearch = false, searchComponent }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth()

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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-gray-900">
              BlueSky Store Locator
            </h1>
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-4">
                <a 
                  href={ROUTES.DASHBOARD}
                  className={`px-3 py-2 text-sm font-medium transition duration-200 ${
                    currentPage === 'dashboard' 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </a>
                <a 
                  href={ROUTES.MALLS}
                  className={`px-3 py-2 text-sm font-medium transition duration-200 ${
                    currentPage === 'map' 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🗺️ Map
                </a>
              </nav>
            )}
          </div>

          {/* Search Section - Center (only on map page) */}
          {showSearch && searchComponent && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              {searchComponent}
            </div>
          )}

          {/* Right Side - User Info */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
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
  )
}