import { Router, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { supabase, withDatabaseRetry } from '../utils/database.js'
import { logger } from '../utils/logger.js'
import {
  authenticateToken,
  AuthenticatedRequest
} from '../middleware/auth.js'
import {
  requirePermission,
  requireRole,
  allowSelfAccess
} from '../middleware/rbac.js'
import {
  validate,
  PaginationSchema,
  IdParamsSchema,
  UserCreateSchema,
  UserUpdateSchema
} from '../middleware/validation.js'

const router = Router()

// Apply authentication to all user routes
router.use(authenticateToken)

/**
 * GET /api/v1/users
 * Get all users (paginated)
 */
router.get('/',
  requirePermission('users', 'list'),
  validate({ query: PaginationSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, sort, order } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('users')
        .select('id, email, name, role, status, created_at, updated_at, last_login', {
          count: 'exact'
        })
        .range(offset, offset + limit - 1)

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      // Apply sorting
      if (sort && order) {
        query = query.order(sort, { ascending: order === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await withDatabaseRetry(
        () => query,
        'getUsers'
      )

      if (error) {
        throw error
      }

      logger.info(`Users retrieved successfully`, {
        userId: req.user?.id,
        count: data?.length,
        page,
        limit
      })

      res.json({
        success: true,
        data: {
          users: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }
      })

    } catch (error) {
      logger.error('Get users error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/users/:id
 * Get a specific user by ID
 */
router.get('/:id',
  validate({ params: IdParamsSchema }),
  allowSelfAccess(),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .select('id, email, name, role, status, created_at, updated_at, last_login')
          .eq('id', id)
          .single(),
        'getUserById'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'User not found'
          })
          return
        }
        throw error
      }

      logger.info(`User retrieved successfully`, {
        userId: req.user?.id,
        targetUserId: id
      })

      res.json({
        success: true,
        data: {
          user: data
        }
      })

    } catch (error) {
      logger.error('Get user error:', error)
      next(error)
    }
  }
)

/**
 * POST /api/v1/users
 * Create a new user
 */
router.post('/',
  requirePermission('users', 'create'),
  validate({ body: UserCreateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, name, password, role } = req.validatedBody!

      // Check if user already exists
      const { data: existingUser } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .select('id')
          .eq('email', email.toLowerCase())
          .single(),
        'checkExistingUser'
      )

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'A user with this email already exists'
        })
        return
      }

      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // Create user
      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .insert({
            email: email.toLowerCase(),
            name,
            password_hash: passwordHash,
            role,
            status: 'active'
          })
          .select('id, email, name, role, status, created_at')
          .single(),
        'createUser'
      )

      if (error) {
        throw error
      }

      logger.info(`User created successfully`, {
        userId: req.user?.id,
        newUserId: data.id,
        email: data.email,
        role: data.role
      })

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: data
        }
      })

    } catch (error) {
      logger.error('Create user error:', error)
      next(error)
    }
  }
)

/**
 * PUT /api/v1/users/:id
 * Update a user
 */
router.put('/:id',
  validate({ params: IdParamsSchema, body: UserUpdateSchema }),
  allowSelfAccess(),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const updateData = req.validatedBody!

      // Users can only update their own info unless they have permission
      const isSelfUpdate = req.user?.id === id
      const hasPermission = req.user?.role === 'admin' || req.user?.role === 'manager'

      if (!isSelfUpdate && !hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You can only update your own profile'
        })
        return
      }

      // Remove sensitive fields if user doesn't have permission
      if (!hasPermission) {
        delete updateData.role
        delete updateData.status
      }

      // Handle email uniqueness
      if (updateData.email) {
        const { data: existingUser } = await withDatabaseRetry(
          () => supabase
            .from('users')
            .select('id')
            .eq('email', updateData.email.toLowerCase())
            .neq('id', id)
            .single(),
          'checkEmailUniqueness'
        )

        if (existingUser) {
          res.status(409).json({
            success: false,
            error: 'Conflict',
            message: 'A user with this email already exists'
          })
          return
        }

        updateData.email = updateData.email.toLowerCase()
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .update(updateData)
          .eq('id', id)
          .select('id, email, name, role, status, created_at, updated_at')
          .single(),
        'updateUser'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'User not found'
          })
          return
        }
        throw error
      }

      logger.info(`User updated successfully`, {
        userId: req.user?.id,
        targetUserId: id,
        updatedFields: Object.keys(updateData)
      })

      res.json({
        success: true,
        message: 'User updated successfully',
        data: {
          user: data
        }
      })

    } catch (error) {
      logger.error('Update user error:', error)
      next(error)
    }
  }
)

/**
 * DELETE /api/v1/users/:id
 * Delete a user (soft delete - set status to inactive)
 */
router.delete('/:id',
  requirePermission('users', 'delete'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      // Prevent users from deleting themselves
      if (req.user?.id === id) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'You cannot delete your own account'
        })
        return
      }

      // Soft delete by setting status to inactive
      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .update({ status: 'inactive' })
          .eq('id', id)
          .select('id, email, name, role')
          .single(),
        'deleteUser'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'User not found'
          })
          return
        }
        throw error
      }

      logger.info(`User deleted (soft delete) successfully`, {
        userId: req.user?.id,
        targetUserId: id,
        targetEmail: data.email
      })

      res.json({
        success: true,
        message: 'User deleted successfully',
        data: {
          user: data
        }
      })

    } catch (error) {
      logger.error('Delete user error:', error)
      next(error)
    }
  }
)

/**
 * POST /api/v1/users/:id/reset-password
 * Reset user password (admin/manager only)
 */
router.post('/:id/reset-password',
  requireRole(['admin', 'manager']),
  validate({
    params: IdParamsSchema,
    body: z.object({
      newPassword: z.string().min(8, 'Password must be at least 8 characters')
    })
  }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const { newPassword } = req.validatedBody!

      // Hash new password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .update({ password_hash: passwordHash })
          .eq('id', id)
          .select('id, email, name')
          .single(),
        'resetUserPassword'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'User not found'
          })
          return
        }
        throw error
      }

      logger.info(`User password reset successfully`, {
        userId: req.user?.id,
        targetUserId: id,
        targetEmail: data.email
      })

      res.json({
        success: true,
        message: 'Password reset successfully',
        data: {
          user: data
        }
      })

    } catch (error) {
      logger.error('Reset password error:', error)
      next(error)
    }
  }
)

export default router