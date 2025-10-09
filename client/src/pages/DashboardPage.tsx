import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import Header from '../components/Header'
import AdminDashboard from '../components/AdminDashboard'
import ManagerDashboard from '../components/ManagerDashboard'
import StoreDashboard from '../components/StoreDashboard'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />
      case 'manager':
        return <ManagerDashboard />
      case 'store':
        return <StoreDashboard />
      default:
        return <div className="p-6 text-center">Unknown role: {user?.role}</div>
    }
  }


  return (
    <div className="bg-gray-50">
      {/* Header */}
      <Header currentPage="dashboard" />

      {/* Role-specific Dashboard Content */}
      <main className="pb-8">
        {renderDashboard()}
      </main>
    </div>
  )
}