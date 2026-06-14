import { useState, useEffect } from 'react'
import { Users, Plus, Search, Eye } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

interface Patient {
  id: number
  user_id: number
  phone?: string
  date_of_birth?: string
  gender?: string
  blood_group?: string
  address?: string
  emergency_contact?: string
  allergies?: string
  created_at: string
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    blood_group: 'A+',
    address: '',
    emergency_contact: '',
    allergies: ''
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients/')
      setPatients(res.data)
    } catch (err: any) {
      toast.error('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/patients/', form)
      toast.success('Patient created successfully!')
      setShowModal(false)
      fetchPatients()
      setForm({
        phone: '', date_of_birth: '', gender: 'Male',
        blood_group: 'A+', address: '', emergency_contact: '', allergies: ''
      })
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create patient')
    }
  }

  const filtered = patients.filter(p =>
    p.phone?.includes(search) ||
    p.blood_group?.toLowerCase().includes(search.toLowerCase()) ||
    p.gender?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all patient records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Patients', value: patients.length, color: 'blue' },
          { label: 'Male', value: patients.filter(p => p.gender === 'Male').length, color: 'green' },
          { label: 'Female', value: patients.filter(p => p.gender === 'Female').length, color: 'pink' },
          { label: 'With Allergies', value: patients.filter(p => p.allergies).length, color: 'amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">{label}</div>
            <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by phone, blood group, gender..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading patients...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No patients found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-blue-600 text-sm hover:underline"
            >
              Add your first patient
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Gender</th>
                <th className="p-4 font-medium">Blood Group</th>
                <th className="p-4 font-medium">Date of Birth</th>
                <th className="p-4 font-medium">Emergency Contact</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">#{patient.id}</td>
                  <td className="p-4">{patient.phone || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      patient.gender === 'Male'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {patient.gender || '—'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      {patient.blood_group || '—'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{patient.date_of_birth || '—'}</td>
                  <td className="p-4 text-gray-500">{patient.emergency_contact || '—'}</td>
                  <td className="p-4">
                    <button className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-xs">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={e => setForm({...form, date_of_birth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm({...form, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={form.blood_group}
                    onChange={e => setForm({...form, blood_group: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  placeholder="123 Main St, Kolkata"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  value={form.emergency_contact}
                  onChange={e => setForm({...form, emergency_contact: e.target.value})}
                  placeholder="Name: +91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allergies</label>
                <input
                  value={form.allergies}
                  onChange={e => setForm({...form, allergies: e.target.value})}
                  placeholder="Penicillin, Peanuts..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}