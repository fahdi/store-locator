import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Store, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Building2,
  Activity,
  BarChart3,
  MapPin,
  Users,
  Settings
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDataService } from '../hooks/useDataService'
import { useActivity } from '../context/ActivityContext'
import { mallAPI } from '../services/api'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

interface ManagerStats {
  assignedStores: number
  openStores: number
  totalMalls: number
  operationalRate: number
}

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { malls, loading, refreshData } = useDataService()
  const { refreshActivities, getRecentActivities } = useActivity()
  const [stats, setStats] = useState<ManagerStats | null>(null)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  useEffect(() => {
    if (malls.length > 0) {
      // In a real app, manager would have assigned malls/stores
      // For demo, we'll use all stores
      const assignedStores = malls.reduce((sum, mall) => sum + mall.stores.length, 0)
      const openStores = malls.reduce((sum, mall) => 
        sum + mall.stores.filter(store => store.isOpen).length, 0
      )
      const totalMalls = malls.length
      const operationalRate = Math.round((openStores / assignedStores) * 100)

      setStats({
        assignedStores,
        openStores,
        totalMalls,
        operationalRate
      })
    }
  }, [malls])

  const handleToggleStore = async (mallId: number, storeId: number, storeName: string, mallName: string, currentStatus: boolean) => {
    const storeKey = `${mallId}-${storeId}`
    if (toggleLoading) return // Prevent multiple simultaneous toggles
    
    setToggleLoading(storeKey)
    try {
      await mallAPI.toggleStore(mallId, storeId)
      await refreshData() // Refresh the data
      await refreshActivities() // Refresh activities from server
      
      const action = currentStatus ? 'closed' : 'opened'
      toast.success(`${storeName} has been ${action}`)
    } catch (error: any) {
      console.error('Failed to toggle store:', error)
      
      // More detailed error messaging
      let errorMessage = `Failed to update ${storeName}.`
      if (error.response?.status === 400) {
        errorMessage = `Cannot open ${storeName}: ${mallName} is closed.`
      } else if (error.response?.status === 404) {
        errorMessage = `Store not found.`
      } else if (error.response?.status === 403) {
        errorMessage = `You don't have permission to modify this store.`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage += ' Please try again.'
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
          <div className="bg-white rounded-xl h-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Manager Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Store Operations Management - {user?.username}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <Store className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.assignedStores}</div>
              </div>
            </div>
          </div>
          <h3 className="font-medium text-gray-900">Assigned Stores</h3>
          <p className="text-sm text-gray-600">{stats.openStores} currently open</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.operationalRate}%</div>
              </div>
            </div>
          </div>
          <h3 className="font-medium text-gray-900">Operational Rate</h3>
          <p className="text-sm text-gray-600">Stores currently operational</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-violet-50 p-3 rounded-lg border border-violet-200">
              <Building2 className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.totalMalls}</div>
              </div>
            </div>
          </div>
          <h3 className="font-medium text-gray-900">Active Malls</h3>
          <p className="text-sm text-gray-600">Locations managed</p>
        </div>
      </div>

      {/* Store Management */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Store Management</h3>
          <Link 
            to={ROUTES.HOME}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View on Map
          </Link>
        </div>
        
        <div className="space-y-4">
          {malls.map((mall) => (
            <div key={mall.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Building2 className={`w-6 h-6 ${mall.isOpen ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{mall.name}</h4>
                    <p className="text-sm text-gray-500">
                      {mall.stores.filter(s => s.isOpen).length}/{mall.stores.length} stores operational
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mall.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {mall.isOpen ? 'Mall Open' : 'Mall Closed'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mall.stores.map((store) => (
                  <div
                    key={store.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      store.isOpen 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{store.name}</h5>
                        <p className="text-xs text-gray-500">{store.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {store.isOpen ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <button 
                          onClick={() => handleToggleStore(mall.id, store.id, store.name, mall.name, store.isOpen)}
                          disabled={(!mall.isOpen && !store.isOpen) || toggleLoading === `${mall.id}-${store.id}`}
                          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            store.isOpen 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } ${
                            (!mall.isOpen && !store.isOpen) || toggleLoading === `${mall.id}-${store.id}`
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          }`}
                          title={
                            !mall.isOpen && !store.isOpen 
                              ? `Cannot open store: ${mall.name} is closed`
                              : `Click to ${store.isOpen ? 'close' : 'open'} ${store.name}`
                          }
                        >
                          {toggleLoading === `${mall.id}-${store.id}` ? (
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            store.isOpen ? 'Close' : 'Open'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to={ROUTES.HOME}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">View Live Map</span>
              </div>
            </Link>
            <div className="relative">
              <button 
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
                disabled
                title="Coming soon - Store Analytics feature under development"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-500">Store Analytics</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Coming soon
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Today</h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">Performance Analytics</h4>
            <p className="text-gray-500 text-sm mb-3">Detailed performance metrics and insights</p>
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4 mr-1" />
              Coming Soon
            </div>
          </div>
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
              <p className="text-gray-400 text-xs">Start by toggling store status</p>
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
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}