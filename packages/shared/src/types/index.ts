// Core application types
export type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'technician'
  created_at: string
  updated_at: string
}

// Runtime type markers for testing
export const UserMarker = 'User' as const
export const EquipmentMarker = 'Equipment' as const
export const WorkOrderMarker = 'WorkOrder' as const
export const TestTypeMarker = 'TestType' as const

export type Equipment = {
  id: string
  name: string
  model: string
  serial_number: string
  category: string
  location: string
  status: 'active' | 'maintenance' | 'retired'
  created_at: string
  updated_at: string
}

export type WorkOrder = {
  id: string
  title: string
  description: string
  equipment_id: string
  assigned_to: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_by: string
  created_at: string
  updated_at: string
  completed_at?: string
}

// Test type for testing purposes
export type TestType = {
  id: string
  name: string
}

// API Response types
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}