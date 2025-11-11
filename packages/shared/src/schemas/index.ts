import { z } from 'zod'

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'manager', 'technician']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
})

export const UpdateUserSchema = CreateUserSchema.partial()

// Equipment schemas
export const EquipmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  model: z.string().max(100),
  serial_number: z.string().max(100),
  category: z.string().max(100),
  location: z.string().max(200),
  status: z.enum(['active', 'maintenance', 'retired']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export const CreateEquipmentSchema = EquipmentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
})

export const UpdateEquipmentSchema = CreateEquipmentSchema.partial()

// Work Order schemas
export const WorkOrderSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  equipment_id: z.string().uuid(),
  assigned_to: z.string().uuid(),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  completed_at: z.string().datetime().optional()
})

export const CreateWorkOrderSchema = WorkOrderSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  completed_at: true
})

export const UpdateWorkOrderSchema = CreateWorkOrderSchema.partial()

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
})

// Test schema for testing purposes
export const testSchema = z.object({
  id: z.string(),
  name: z.string()
})

// Query parameter schemas
export const PaginationQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1).default(1)),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100).default(20)),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})