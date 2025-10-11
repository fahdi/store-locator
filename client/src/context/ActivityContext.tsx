import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { activityAPI } from '../services/api'

export interface Activity {
  id: string
  type: 'mall_toggle' | 'store_toggle' | 'store_edit'
  mallName: string
  mallId: number
  storeName?: string
  storeId?: number
  timestamp: string
  user: string
  action: string // 'opened', 'closed', 'updated'
  description: string
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'user'>) => void
  clearActivities: () => void
  getRecentActivities: (limit?: number) => Activity[]
  refreshActivities: () => Promise<void>
  loading: boolean
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}

interface ActivityProviderProps {
  children: ReactNode
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  // Load activities from server on mount and when user logs in
  const refreshActivities = useCallback(async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const serverActivities = await activityAPI.getActivities(50)
      setActivities(serverActivities)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      refreshActivities()
    } else {
      setActivities([])
    }
  }, [isAuthenticated, refreshActivities])

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp' | 'user'>) => {
    if (!user) return

    // Note: Server now handles activity creation, but we keep this for optimistic updates
    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      user: user.username
    }

    setActivities(prev => [newActivity, ...prev])
  }, [user])

  const clearActivities = useCallback(() => {
    setActivities([])
  }, [])

  const getRecentActivities = useCallback((limit = 10) => {
    return activities.slice(0, limit)
  }, [activities])

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffMs = now.getTime() - activityTime.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  // Update timestamps for existing activities
  const activitiesWithFormattedTime = activities.map(activity => ({
    ...activity,
    formattedTime: formatTimeAgo(activity.timestamp)
  }))

  const value: ActivityContextType = {
    activities: activitiesWithFormattedTime,
    addActivity,
    clearActivities,
    getRecentActivities: (limit = 10) => activitiesWithFormattedTime.slice(0, limit),
    refreshActivities,
    loading
  }

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}