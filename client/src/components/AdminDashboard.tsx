import { useState, useEffect } from 'react'
import { 
  Building2, 
  Store, 
  TrendingUp, 
  Users, 
  Clock,
  MoreHorizontal,
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
import { Mall } from '../types'

interface DashboardStats {
  totalMalls: number
  totalStores: number
  openMalls: number
  openStores: number
  recentActivity: Array<{
    id: string
    type: 'mall_toggle' | 'store_toggle' | 'store_edit'
    mallName: string
    storeName?: string
    timestamp: string
    user: string
  }>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { malls, loading } = useDataService()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    if (malls.length > 0) {
      const totalMalls = malls.length
      const totalStores = malls.reduce((sum, mall) => sum + mall.stores.length, 0)
      const openMalls = malls.filter(mall => mall.isOpen).length
      const openStores = malls.reduce((sum, mall) => 
        sum + mall.stores.filter(store => store.isOpen).length, 0
      )

      // Mock recent activity - in real app this would come from audit logs
      const recentActivity = [
        {
          id: '1',
          type: 'mall_toggle' as const,
          mallName: 'Villaggio Mall',
          timestamp: '2 hours ago',
          user: 'admin'
        },
        {
          id: '2', 
          type: 'store_toggle' as const,
          mallName: 'City Center Doha',
          storeName: 'Nike Store',
          timestamp: '4 hours ago',
          user: 'manager'
        },
        {
          id: '3',
          type: 'store_edit' as const,
          mallName: 'Landmark Mall',
          storeName: 'Starbucks',
          timestamp: '1 day ago',
          user: 'store'
        }
      ]

      setStats({
        totalMalls,
        totalStores,
        openMalls,
        openStores,
        recentActivity
      })
    }
  }, [malls])

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
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-white',
      progress: (stats.openMalls / stats.totalMalls) * 100
    },
    {
      title: 'Total Stores', 
      value: stats.totalStores,
      subtitle: `${stats.openStores} currently open`,
      icon: Store,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-white',
      progress: (stats.openStores / stats.totalStores) * 100
    },
    {
      title: 'Operational Rate',
      value: `${Math.round((stats.openStores / stats.totalStores) * 100)}%`,
      subtitle: 'Stores currently operational',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-white',
      progress: (stats.openStores / stats.totalStores) * 100
    },
    {
      title: 'System Status',
      value: 'Healthy',
      subtitle: 'All systems operational',
      icon: Activity,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-white',
      progress: 100
    }
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <section 
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white"
        aria-labelledby="welcome-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 id="welcome-heading" className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.username}
            </h1>
            <p className="text-indigo-100 text-base md:text-lg">
              Admin Dashboard - BlueSky Store Locator Management
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-4" aria-hidden="true">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Users className="w-8 h-8" />
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
              className="stagger-item group relative overflow-hidden bg-white rounded-xl md:rounded-2xl shadow-sm hover-lift card-hover gpu-accelerated"
              role="article"
              aria-labelledby={`stat-${index}-title`}
            >
              <div className={`${stat.color} p-4 md:p-6 ${stat.textColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 opacity-80" aria-hidden="true" />
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-bold" aria-label={`${stat.title}: ${stat.value}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 id={`stat-${index}-title`} className="font-semibold text-white/90">
                    {stat.title}
                  </h3>
                  <p className="text-sm text-white/70">{stat.subtitle}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3" role="progressbar" aria-valuenow={stat.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${stat.title} progress: ${stat.progress}%`}>
                    <div 
                      className="bg-white h-2 rounded-full animate-progress"
                      style={{ '--progress-width': `${stat.progress}%`, width: `${stat.progress}%` } as React.CSSProperties}
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
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-400" aria-hidden="true" />
            </div>
            
            <nav className="space-y-3 md:space-y-4" aria-label="Quick actions navigation">
              <button 
                className="w-full flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-describedby="view-map-desc"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg" aria-hidden="true">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Live Map</div>
                    <div id="view-map-desc" className="text-sm text-gray-500">Monitor all locations</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" aria-hidden="true" />
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg md:rounded-xl hover:from-emerald-100 hover:to-green-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-describedby="view-analytics-desc"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500 rounded-lg" aria-hidden="true">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Analytics</div>
                    <div id="view-analytics-desc" className="text-sm text-gray-500">Performance insights</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" aria-hidden="true" />
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg md:rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-describedby="manage-users-desc"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg" aria-hidden="true">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Manage Users</div>
                    <div id="manage-users-desc" className="text-sm text-gray-500">Roles & permissions</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" aria-hidden="true" />
              </button>
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
                    {mall.isOpen ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
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
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'mall_toggle' ? 'bg-blue-100' :
                    activity.type === 'store_toggle' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'mall_toggle' ? (
                      <Building2 className={`w-4 h-4 ${
                        activity.type === 'mall_toggle' ? 'text-blue-600' :
                        activity.type === 'store_toggle' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    ) : activity.type === 'store_toggle' ? (
                      <Store className="w-4 h-4 text-green-600" />
                    ) : (
                      <Settings className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {activity.type === 'mall_toggle' && `Mall ${activity.mallName} status changed`}
                      {activity.type === 'store_toggle' && `${activity.storeName} in ${activity.mallName} toggled`}
                      {activity.type === 'store_edit' && `${activity.storeName} details updated`}
                    </div>
                    <div className="text-sm text-gray-500">
                      by {activity.user} • {activity.timestamp}
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}