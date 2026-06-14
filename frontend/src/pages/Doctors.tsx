import { useState, useEffect } from 'react'
import { Stethoscope, Plus, Search } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

interface Doctor {
  id: number
  user_id: number
  specialization?: string
  license_number?: string
  phone?: string
  experience_years?: number
  consultation_fee?: number
  bio?: string
  available_days?: string
  created_at: string
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    specialization: '',
    license_number: '',
    phone: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
    available_days: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors/')
      setDoctors(res.data)
    } catch (err: any) {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/doctors/', {
        ...form,
        experience_years: parseInt(form.experience_years),
        consultation_fee: parseFloat(form.consultation_fee)
      })
      toast.success('Doctor created successfully!')
      setShowModal(false)
      fetchDoctors()
      setForm({
        specialization: '',
        license_number: '',
        phone: '',
        experience_years: '',
        consultation_fee: '',
        bio: '',
        available_days: ''
      })
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create doctor')
    }
  }

  const filtered = doctors.filter(d =>
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search)
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all doctor profiles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Total Doctors</div>
          <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Specializations</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(doctors.map(d => d.specialization)).size}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Avg Experience</div>
          <div className="text-2xl font-bold text-blue-600">
            {doctors.length
              ? Math.round(doctors.reduce((a, d) => a + (d.experience_years || 0), 0) / doctors.length) + ' yrs'
              : '0 yrs'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by specialization, phone..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No doctors found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-blue-600 text-sm hover:underline"
            >
              Add your first doctor
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Specialization</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium">Fee</th>
                <th className="p-4 font-medium">Available Days</th>
                <th className="p-4 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doctor) => (
                <tr key={doctor.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">#{doctor.id}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {doctor.specialization || '-'}
                    </span>
                  </td>
                  <td className="p-4">{doctor.phone || '-'}</td>
                  <td className="p-4">
                    {doctor.experience_years ? doctor.experience_years + ' yrs' : '-'}
                  </td>
                  <td className="p-4">
                    {doctor.consultation_fee ? 'Rs.' + doctor.consultation_fee : '-'}
                  </td>
                  <td className="p-4 text-gray-500">{doctor.available_days || '-'}</td>
                  <td className="p-4 text-gray-500">{doctor.license_number || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Doctor</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    value={form.specialization}
                    onChange={e => setForm({...form, specialization: e.target.value})}
                    placeholder="Cardiology"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    value={form.license_number}
                    onChange={e => setForm({...form, license_number: e.target.value})}
                    placeholder="MED-12345"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    value={form.experience_years}
                    onChange={e => setForm({...form, experience_years: e.target.value})}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <input
                    type="number"
                    value={form.consultation_fee}
                    onChange={e => setForm({...form, consultation_fee: e.target.value})}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Available Days</label>
                  <input
                    value={form.available_days}
                    onChange={e => setForm({...form, available_days: e.target.value})}
                    placeholder="Mon, Wed, Fri"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({...form, bio: e.target.value})}
                  placeholder="Brief description about the doctor..."
                  rows={2}
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
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}