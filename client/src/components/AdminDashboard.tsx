import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  Store, 
  TrendingUp, 
  Users, 
  Clock,
  ChevronRight,
  Activity,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  MapPin
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDataService } from '../hooks/useDataService'
import { useActivity } from '../context/ActivityContext'
import { mallAPI } from '../services/api'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalMalls: number
  totalStores: number
  openMalls: number
  openStores: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { malls, loading, refreshData } = useDataService()
  const { getRecentActivities, refreshActivities } = useActivity()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)

  useEffect(() => {
    if (malls.length > 0) {
      const totalMalls = malls.length
      const totalStores = malls.reduce((sum, mall) => sum + mall.stores.length, 0)
      const openMalls = malls.filter(mall => mall.isOpen).length
      const openStores = malls.reduce((sum, mall) => 
        sum + mall.stores.filter(store => store.isOpen).length, 0
      )

      setStats({
        totalMalls,
        totalStores,
        openMalls,
        openStores
      })
    }
  }, [malls])

  const handleToggleMall = async (mallId: number, mallName: string, currentStatus: boolean) => {
    if (toggleLoading) return // Prevent multiple simultaneous toggles
    
    setToggleLoading(mallId)
    try {
      await mallAPI.toggleMall(mallId)
      await refreshData() // Refresh the data
      await refreshActivities() // Refresh activities from server
      
      const action = currentStatus ? 'closed' : 'opened'
      toast.success(`${mallName} has been ${action}`)
    } catch (error: any) {
      console.error('Failed to toggle mall:', error)
      
      // More detailed error messaging
      let errorMessage = `Failed to update ${mallName}.`
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.'
      } else if (error.response?.status === 403) {
        errorMessage = 'Admin access required to toggle malls.'
      } else if (error.response?.status === 404) {
        errorMessage = `Mall "${mallName}" not found.`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      toast.error(errorMessage)
    } finally {
      setToggleLoading(null)
    }
  }

  if (loading || !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total Malls',
      value: stats.totalMalls,
      subtitle: `${stats.openMalls} currently open`,
      icon: Building2,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      progress: (stats.openMalls / stats.totalMalls) * 100,
      progressColor: 'bg-blue-600'
    },
    {
      title: 'Total Stores', 
      value: stats.totalStores,
      subtitle: `${stats.openStores} currently open`,
      icon: Store,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      progress: (stats.openStores / stats.totalStores) * 100,
      progressColor: 'bg-emerald-600'
    },
    {
      title: 'Operational Rate',
      value: `${Math.round((stats.openStores / stats.totalStores) * 100)}%`,
      subtitle: 'Stores currently operational',
      icon: TrendingUp,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50',
      progress: (stats.openStores / stats.totalStores) * 100,
      progressColor: 'bg-violet-600'
    },
    {
      title: 'System Status',
      value: 'Healthy',
      subtitle: 'All systems operational',
      icon: Activity,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      progress: 100,
      progressColor: 'bg-green-600'
    }
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <section 
        className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 lg:p-8"
        aria-labelledby="welcome-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 id="welcome-heading" className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Welcome back, {user?.username}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Admin Dashboard - BlueSky Store Locator Management
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-4" aria-hidden="true">
            <div className="bg-gray-50 rounded-lg p-4">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">System Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="stagger-item group relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              role="article"
              aria-labelledby={`stat-${index}-title`}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold text-gray-900" aria-label={`${stat.title}: ${stat.value}`}>
                        {stat.value}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 id={`stat-${index}-title`} className="font-medium text-gray-900">
                    {stat.title}
                  </h3>
                  <p className="text-sm text-gray-600">{stat.subtitle}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3" role="progressbar" aria-valuenow={stat.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${stat.title} progress: ${stat.progress}%`}>
                    <div 
                      className={`${stat.progressColor} h-1.5 rounded-full transition-all duration-300`}
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6" aria-labelledby="quick-actions-heading">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 id="quick-actions-heading" className="text-lg md:text-xl font-bold text-gray-900">Quick Actions</h3>
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-300" aria-hidden="true" />
            </div>
            
            <nav className="space-y-3" aria-label="Quick actions navigation">
              <Link 
                to={ROUTES.MAP}
                className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-describedby="view-map-desc"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg" aria-hidden="true">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Live Map</div>
                    <div id="view-map-desc" className="text-sm text-gray-500">Monitor all locations</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" aria-hidden="true" />
              </Link>

              <div 
                className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed group relative"
                aria-describedby="view-analytics-desc"
                title="Feature coming soon"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg" aria-hidden="true">
                    <BarChart3 className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-600">View Analytics</div>
                    <div id="view-analytics-desc" className="text-sm text-gray-500">Coming soon</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Soon</span>
                  <ChevronRight className="w-5 h-5 text-gray-300" aria-hidden="true" />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Analytics dashboard coming soon
                </div>
              </div>

              <div 
                className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed group relative"
                aria-describedby="manage-users-desc"
                title="Feature coming soon"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg" aria-hidden="true">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-600">Manage Users</div>
                    <div id="manage-users-desc" className="text-sm text-gray-500">Coming soon</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Soon</span>
                  <ChevronRight className="w-5 h-5 text-gray-300" aria-hidden="true" />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  User management coming soon
                </div>
              </div>
            </nav>
          </section>
        </div>

        {/* Mall Overview & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Mall Quick Overview */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Mall Overview</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {malls.slice(0, 4).map((mall) => (
                <div
                  key={mall.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${mall.isOpen ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Building2 className={`w-5 h-5 ${mall.isOpen ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{mall.name}</div>
                      <div className="text-sm text-gray-500">
                        {mall.stores.filter(s => s.isOpen).length}/{mall.stores.length} stores open
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleMall(mall.id, mall.name, mall.isOpen)}
                      disabled={toggleLoading === mall.id}
                      className={`p-2 rounded-lg border transition-colors ${
                        mall.isOpen
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                          : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      } ${toggleLoading === mall.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                      title={`Click to ${mall.isOpen ? 'close' : 'open'} ${mall.name}`}
                    >
                      {toggleLoading === mall.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : mall.isOpen ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      mall.isOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mall.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {getRecentActivities(5).length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                  <p className="text-gray-400 text-xs">Start by toggling mall or store status</p>
                </div>
              ) : (
                getRecentActivities(5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'mall_toggle' ? 'bg-blue-100' :
                      activity.type === 'store_toggle' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'mall_toggle' ? (
                        <Building2 className="w-4 h-4 text-blue-600" />
                      ) : activity.type === 'store_toggle' ? (
                        <Store className="w-4 h-4 text-green-600" />
                      ) : (
                        <Settings className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {activity.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        by {activity.user} • {(activity as any).formattedTime}
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}