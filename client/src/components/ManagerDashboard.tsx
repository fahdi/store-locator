import { useState, useEffect } from 'react'
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
  Users
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDataService } from '../hooks/useDataService'

interface ManagerStats {
  assignedStores: number
  openStores: number
  totalMalls: number
  operationalRate: number
}

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { malls, loading } = useDataService()
  const [stats, setStats] = useState<ManagerStats | null>(null)

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
      <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-amber-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Manager Dashboard
            </h1>
            <p className="text-orange-100 text-lg">
              Store Operations Management - {user?.username}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Store className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Store className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.assignedStores}</div>
            </div>
          </div>
          <h3 className="font-semibold text-white/90">Assigned Stores</h3>
          <p className="text-sm text-white/70">{stats.openStores} currently open</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.operationalRate}%</div>
            </div>
          </div>
          <h3 className="font-semibold text-white/90">Operational Rate</h3>
          <p className="text-sm text-white/70">Stores currently operational</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.totalMalls}</div>
            </div>
          </div>
          <h3 className="font-semibold text-white/90">Active Malls</h3>
          <p className="text-sm text-white/70">Locations managed</p>
        </div>
      </div>

      {/* Store Management */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Store Management</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View on Map
          </button>
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
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            store.isOpen 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } transition-colors`}
                          disabled={!mall.isOpen && !store.isOpen}
                        >
                          {store.isOpen ? 'Close' : 'Open'}
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
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">View Live Map</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Store Analytics</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Today</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Stores Opened</span>
              <span className="font-bold text-green-600">+{Math.floor(stats.openStores * 0.3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status Changes</span>
              <span className="font-bold text-blue-600">{Math.floor(stats.assignedStores * 0.1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Issues Resolved</span>
              <span className="font-bold text-purple-600">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}