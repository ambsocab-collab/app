// Core application types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'technician'
  created_at: string
  updated_at: string
}

export interface Equipment {
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

export interface WorkOrder {
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

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}