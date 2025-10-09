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
    <header 
      className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300"
      role="banner"
      aria-label="Site header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                <span className="hidden sm:inline">BlueSky Store Locator</span>
                <span className="sm:hidden">BlueSky</span>
              </h1>
            </div>
            {isAuthenticated && (
              <nav 
                className="hidden md:flex space-x-4" 
                role="navigation" 
                aria-label="Main navigation"
              >
                <a 
                  href={ROUTES.DASHBOARD}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    currentPage === 'dashboard' 
                      ? 'text-blue-600 bg-blue-50 font-semibold' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-current={currentPage === 'dashboard' ? 'page' : undefined}
                >
                  Dashboard
                </a>
                <a 
                  href={ROUTES.HOME}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    currentPage === 'map' 
                      ? 'text-blue-600 bg-blue-50 font-semibold' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-current={currentPage === 'map' ? 'page' : undefined}
                >
                  <span role="img" aria-label="Map icon">🗺️</span>
                  <span>Interactive Map</span>
                </a>
              </nav>
            )}
          </div>

          {/* Search Section - Center (only on map page) */}
          {showSearch && searchComponent && (
            <div 
              className="hidden md:flex flex-1 max-w-2xl mx-4"
              role="search"
              aria-label="Search stores and malls"
            >
              {searchComponent}
            </div>
          )}

          {/* Right Side - User Info */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-3" role="group" aria-label="User information">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium text-gray-900" aria-label={`Username: ${user?.username}`}>
                      {user?.username}
                    </div>
                    <div className="text-xs text-gray-500" aria-label={`Role: ${user?.role}`}>
                      Logged in as {user?.role}
                    </div>
                  </div>
                  <div className="relative" role="img" aria-label={`${user?.username} avatar, ${user?.role} role`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                      user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user?.role === 'manager' ? 'bg-yellow-100 text-yellow-700' :
                      user?.role === 'store' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user?.role === 'admin' ? 'bg-red-500' :
                        user?.role === 'manager' ? 'bg-yellow-500' :
                        user?.role === 'store' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}
                      aria-label={`${user?.role} status indicator`}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Logout from your account"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </>
            ) : (
              <a
                href={ROUTES.LOGIN}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Login to your account"
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