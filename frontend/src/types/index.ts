export interface User {
  id: number
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist' | 'lab_technician' | 'pharmacist'

export interface Patient {
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

export interface Appointment {
  id: number
  patient_id: number
  doctor_id: number
  appointment_date: string
  reason?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  created_at: string
}