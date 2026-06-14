import { useAuthStore } from '../store/authStore'
import { Users, Calendar, FlaskConical, DollarSign, TrendingUp, Activity } from 'lucide-react'

const stats = [
  { label: 'Total Patients', value: '1,284', change: '+12% this month', icon: Users, color: 'blue' },
  { label: "Today's Appointments", value: '38', change: '5 pending', icon: Calendar, color: 'green' },
  { label: 'Lab Reports', value: '17', change: '3 critical', icon: FlaskConical, color: 'amber' },
  { label: 'Revenue Today', value: '₹84,000', change: '+8% vs yesterday', icon: DollarSign, color: 'purple' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
}

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.full_name} 👋</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium">Patient</th>
                <th className="pb-2 font-medium">Doctor</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                { name: 'Arjun Sharma', doctor: 'Dr. Mehta', status: 'Active', date: 'Today', color: 'bg-green-100 text-green-700' },
                { name: 'Priya Das', doctor: 'Dr. Singh', status: 'Pending', date: 'Today', color: 'bg-amber-100 text-amber-700' },
                { name: 'Rahul Bose', doctor: 'Dr. Mehta', status: 'Admitted', date: 'Yesterday', color: 'bg-blue-100 text-blue-700' },
                { name: 'Sunita Roy', doctor: 'Dr. Khan', status: 'Critical', date: 'Yesterday', color: 'bg-red-100 text-red-700' },
              ].map((p) => (
                <tr key={p.name} className="border-b border-gray-50">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.doctor}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.color}`}>{p.status}</span></td>
                  <td className="py-3 text-gray-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">AI Features</h3>
          <div className="space-y-2">
            {[
              { label: 'Symptom Checker', sub: 'AI diagnosis helper', color: 'bg-blue-50 text-blue-600' },
              { label: 'Report Summarizer', sub: 'Auto-read lab reports', color: 'bg-green-50 text-green-600' },
              { label: 'Prescription AI', sub: 'Drug interaction check', color: 'bg-amber-50 text-amber-600' },
              { label: 'Health Chatbot', sub: '24/7 patient support', color: 'bg-purple-50 text-purple-600' },
            ].map((f) => (
              <div key={f.label} className={`flex items-center gap-3 p-3 rounded-lg ${f.color} cursor-pointer`}>
                <Activity className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs opacity-70">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}