import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Calendar, Stethoscope,
  FileText, Pill, FlaskConical, Receipt,
  BarChart3, Settings, Heart, LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
  { icon: FileText, label: 'Medical Records', path: '/records' },
  { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
  { icon: FlaskConical, label: 'Lab Reports', path: '/lab' },
  { icon: Receipt, label: 'Billing', path: '/billing' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">MediCare HMS</div>
            <div className="text-[10px] text-gray-400 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors ${
                active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2.5 px-2 py-1.5 mb-2">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">
            {user?.full_name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">{user?.full_name}</div>
            <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}