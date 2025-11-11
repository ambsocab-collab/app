import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema, ZodError } from 'zod'
import { logger } from '../utils/logger.js'

// Extended Request interface for validation
export interface ValidatedRequest extends Request {
  validatedBody?: any
  validatedQuery?: any
  validatedParams?: any
}

/**
 * Validate request body against a Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body)

      if (!result.success) {
        const errorDetails = result.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message,
          code: error.code,
          expected: error.expected,
          received: error.received
        }))

        logger.warn('Request body validation failed', {
          path: req.path,
          method: req.method,
          errors: errorDetails,
          body: req.body
        })

        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Invalid request body data',
          details: errorDetails
        })
        return
      }

      // Attach validated data to request
      req.validatedBody = result.data
      next()

    } catch (error) {
      logger.error('Body validation middleware error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Validation service temporarily unavailable'
      })
    }
  }
}

/**
 * Validate request query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query)

      if (!result.success) {
        const errorDetails = result.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message,
          code: error.code
        }))

        logger.warn('Request query validation failed', {
          path: req.path,
          method: req.method,
          errors: errorDetails,
          query: req.query
        })

        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Invalid query parameters',
          details: errorDetails
        })
        return
      }

      // Attach validated data to request
      req.validatedQuery = result.data
      next()

    } catch (error) {
      logger.error('Query validation middleware error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Validation service temporarily unavailable'
      })
    }
  }
}

/**
 * Validate request parameters against a Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params)

      if (!result.success) {
        const errorDetails = result.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message,
          code: error.code
        }))

        logger.warn('Request params validation failed', {
          path: req.path,
          method: req.method,
          errors: errorDetails,
          params: req.params
        })

        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Invalid URL parameters',
          details: errorDetails
        })
        return
      }

      // Attach validated data to request
      req.validatedParams = result.data
      next()

    } catch (error) {
      logger.error('Params validation middleware error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Validation service temporarily unavailable'
      })
    }
  }
}

/**
 * Validate multiple parts of the request (body, query, params)
 */
export const validate = (options: {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const validationErrors: any[] = []

      // Validate body if schema provided
      if (options.body) {
        const bodyResult = options.body.safeParse(req.body)
        if (!bodyResult.success) {
          validationErrors.push(
            ...bodyResult.error.errors.map(error => ({
              location: 'body',
              field: error.path.join('.'),
              message: error.message,
              code: error.code
            }))
          )
        } else {
          req.validatedBody = bodyResult.data
        }
      }

      // Validate query if schema provided
      if (options.query) {
        const queryResult = options.query.safeParse(req.query)
        if (!queryResult.success) {
          validationErrors.push(
            ...queryResult.error.errors.map(error => ({
              location: 'query',
              field: error.path.join('.'),
              message: error.message,
              code: error.code
            }))
          )
        } else {
          req.validatedQuery = queryResult.data
        }
      }

      // Validate params if schema provided
      if (options.params) {
        const paramsResult = options.params.safeParse(req.params)
        if (!paramsResult.success) {
          validationErrors.push(
            ...paramsResult.error.errors.map(error => ({
              location: 'params',
              field: error.path.join('.'),
              message: error.message,
              code: error.code
            }))
          )
        } else {
          req.validatedParams = paramsResult.data
        }
      }

      // If there are validation errors, return them
      if (validationErrors.length > 0) {
        logger.warn('Request validation failed', {
          path: req.path,
          method: req.method,
          errors: validationErrors,
          body: options.body ? req.body : undefined,
          query: options.query ? req.query : undefined,
          params: options.params ? req.params : undefined
        })

        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Invalid request data',
          details: validationErrors
        })
        return
      }

      // All validations passed
      next()

    } catch (error) {
      logger.error('Validation middleware error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Validation service temporarily unavailable'
      })
    }
  }
}

/**
 * Common validation schemas
 */

// UUID parameter validation
export const UUIDSchema = z.string().uuid('Invalid ID format')

// Pagination schema
export const PaginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1).default(1)),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100).default(20)),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})

// Date range schema
export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate)
    }
    return true
  },
  {
    message: "Start date must be before end date",
    path: ["endDate"]
  }
)

// ID parameter schema
export const IdParamsSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

// User-specific schemas
export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'manager', 'technician'], {
    errorMap: () => ({ message: 'Invalid role. Must be admin, manager, or technician' })
  })
})

export const UserUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  role: z.enum(['admin', 'manager', 'technician']).optional(),
  status: z.enum(['active', 'inactive']).optional()
})

// Equipment-specific schemas
export const EquipmentCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  model: z.string().max(100, 'Model must be 100 characters or less').optional(),
  serial_number: z.string().max(100, 'Serial number must be 100 characters or less').optional(),
  category: z.string().max(100, 'Category must be 100 characters or less').optional(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  status: z.enum(['active', 'maintenance', 'retired']).default('active')
})

export const EquipmentUpdateSchema = EquipmentCreateSchema.partial()

// Work Order schemas
export const WorkOrderCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  equipment_id: z.string().uuid('Invalid equipment ID'),
  assigned_to: z.string().uuid('Invalid assignee ID'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
})

export const WorkOrderUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  equipment_id: z.string().uuid('Invalid equipment ID').optional(),
  assigned_to: z.string().uuid('Invalid assignee ID').optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
})

// Spare Parts schemas
export const SparePartCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  part_number: z.string().max(100, 'Part number must be 100 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  category: z.string().max(100, 'Category must be 100 characters or less').optional(),
  quantity: z.number().int().min(0, 'Quantity must be a non-negative integer').default(0),
  unit_price: z.number().min(0, 'Unit price must be non-negative').optional(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional()
})

export const SparePartUpdateSchema = SparePartCreateSchema.partial()

/**
 * Sanitization middleware to prevent XSS
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const sanitize = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj
      }

      if (Array.isArray(obj)) {
        return obj.map(sanitize)
      }

      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          // Basic XSS prevention - remove script tags and dangerous attributes
          sanitized[key] = value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '')
        } else if (typeof value === 'object') {
          sanitized[key] = sanitize(value)
        } else {
          sanitized[key] = value
        }
      }
      return sanitized
    }

    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitize(req.body)
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitize(req.query)
    }

    next()

  } catch (error) {
    logger.error('Input sanitization error:', error)
    // Don't block the request for sanitization errors
    next()
  }
}

/**
 * File upload validation middleware
 */
export const validateFileUpload = (options: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  required?: boolean
}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    required = false
  } = options

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const file = req.file

      if (!file) {
        if (required) {
          res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: 'File is required'
          })
          return
        }
        next()
        return
      }

      // Check file size
      if (file.size > maxSize) {
        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
        })
        return
      }

      // Check file type
      if (!allowedTypes.includes(file.mimetype)) {
        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
        })
        return
      }

      next()

    } catch (error) {
      logger.error('File upload validation error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'File validation service temporarily unavailable'
      })
    }
  }
}

export default {
  validateBody,
  validateQuery,
  validateParams,
  validate,
  sanitizeInput,
  validateFileUpload,
  // Common schemas
  UUIDSchema,
  PaginationSchema,
  DateRangeSchema,
  IdParamsSchema,
  UserCreateSchema,
  UserUpdateSchema,
  EquipmentCreateSchema,
  EquipmentUpdateSchema,
  WorkOrderCreateSchema,
  WorkOrderUpdateSchema,
  SparePartCreateSchema,
  SparePartUpdateSchema
}