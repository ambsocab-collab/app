import { Router, Response, NextFunction } from 'express'
import { z } from 'zod'
import { supabase, withDatabaseRetry } from '../utils/database.js'
import { logger } from '../utils/logger.js'
import {
  authenticateToken,
  AuthenticatedRequest
} from '../middleware/auth.js'
import {
  requirePermission,
  allowSelfAccess
} from '../middleware/rbac.js'
import {
  validate,
  PaginationSchema,
  IdParamsSchema,
  WorkOrderCreateSchema,
  WorkOrderUpdateSchema,
  DateRangeSchema
} from '../middleware/validation.js'

const router = Router()

// Apply authentication to all work order routes
router.use(authenticateToken)

/**
 * GET /api/v1/work-orders
 * Get all work orders (paginated)
 */
router.get('/',
  requirePermission('work_orders', 'list'),
  validate({ query: PaginationSchema.extend(DateRangeSchema.shape) }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, sort, order, startDate, endDate } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('work_orders')
        .select(`
          *,
          equipment!work_orders_equipment_id_fkey (
            id,
            name,
            location
          ),
          users!work_orders_assigned_to_fkey (
            id,
            name,
            email
          ),
          creator:users!work_orders_created_by_fkey (
            id,
            name,
            email
          )
        `, {
          count: 'exact'
        })
        .range(offset, offset + limit - 1)

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Apply date range filter
      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      // Apply sorting
      if (sort && order) {
        query = query.order(sort, { ascending: order === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await withDatabaseRetry(
        () => query,
        'getWorkOrders'
      )

      if (error) {
        throw error
      }

      logger.info(`Work orders retrieved successfully`, {
        userId: req.user?.id,
        count: data?.length,
        page,
        limit
      })

      res.json({
        success: true,
        data: {
          workOrders: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }
      })

    } catch (error) {
      logger.error('Get work orders error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/work-orders/my
 * Get work orders assigned to current user
 */
router.get('/my',
  requirePermission('work_orders', 'read'),
  validate({ query: PaginationSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, sort, order } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('work_orders')
        .select(`
          *,
          equipment!work_orders_equipment_id_fkey (
            id,
            name,
            location
          ),
          users!work_orders_created_by_fkey (
            id,
            name,
            email
          )
        `, {
          count: 'exact'
        })
        .eq('assigned_to', req.user!.id)
        .range(offset, offset + limit - 1)

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Apply sorting
      if (sort && order) {
        query = query.order(sort, { ascending: order === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await withDatabaseRetry(
        () => query,
        'getMyWorkOrders'
      )

      if (error) {
        throw error
      }

      logger.info(`My work orders retrieved successfully`, {
        userId: req.user?.id,
        count: data?.length,
        page,
        limit
      })

      res.json({
        success: true,
        data: {
          workOrders: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }
      })

    } catch (error) {
      logger.error('Get my work orders error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/work-orders/:id
 * Get specific work order by ID
 */
router.get('/:id',
  requirePermission('work_orders', 'read'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .select(`
            *,
            equipment!work_orders_equipment_id_fkey (
              id,
              name,
              location,
              serial_number
            ),
            users!work_orders_assigned_to_fkey (
              id,
              name,
              email,
              role
            ),
            creator:users!work_orders_created_by_fkey (
              id,
              name,
              email
            )
          `)
          .eq('id', id)
          .single(),
        'getWorkOrderById'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Work order not found'
          })
          return
        }
        throw error
      }

      logger.info(`Work order retrieved successfully`, {
        userId: req.user?.id,
        workOrderId: id
      })

      res.json({
        success: true,
        data: {
          workOrder: data
        }
      })

    } catch (error) {
      logger.error('Get work order error:', error)
      next(error)
    }
  }
)

/**
 * POST /api/v1/work-orders
 * Create new work order
 */
router.post('/',
  requirePermission('work_orders', 'create'),
  validate({ body: WorkOrderCreateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, equipment_id, assigned_to, priority } = req.validatedBody!

      // Verify equipment exists
      const { data: equipment, error: equipmentError } = await withDatabaseRetry(
        () => supabase
          .from('equipment')
          .select('id, name')
          .eq('id', equipment_id)
          .single(),
        'verifyEquipment'
      )

      if (equipmentError || !equipment) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Invalid equipment ID'
        })
        return
      }

      // Verify assignee exists
      const { data: assignee, error: assigneeError } = await withDatabaseRetry(
        () => supabase
          .from('users')
          .select('id, name, email')
          .eq('id', assigned_to)
          .eq('status', 'active')
          .single(),
        'verifyAssignee'
      )

      if (assigneeError || !assignee) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Invalid assignee ID'
        })
        return
      }

      const workOrderData = {
        title,
        description,
        equipment_id,
        assigned_to,
        priority: priority || 'medium',
        created_by: req.user!.id,
        status: 'open'
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .insert(workOrderData)
          .select(`
            *,
            equipment!work_orders_equipment_id_fkey (
              id,
              name,
              location
            ),
            users!work_orders_assigned_to_fkey (
              id,
              name,
              email
            ),
            creator:users!work_orders_created_by_fkey (
              id,
              name,
              email
            )
          `)
          .single(),
        'createWorkOrder'
      )

      if (error) {
        throw error
      }

      logger.info(`Work order created successfully`, {
        userId: req.user?.id,
        workOrderId: data.id,
        title: data.title,
        assignedTo: assigned_to
      })

      res.status(201).json({
        success: true,
        message: 'Work order created successfully',
        data: {
          workOrder: data
        }
      })

    } catch (error) {
      logger.error('Create work order error:', error)
      next(error)
    }
  }
)

/**
 * PUT /api/v1/work-orders/:id
 * Update work order
 */
router.put('/:id',
  validate({ params: IdParamsSchema, body: WorkOrderUpdateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const updateData = req.validatedBody!

      // Get current work order to check permissions
      const { data: currentWorkOrder, error: fetchError } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .select('assigned_to, created_by, status')
          .eq('id', id)
          .single(),
        'getWorkOrderForPermissionCheck'
      )

      if (fetchError || !currentWorkOrder) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Work order not found'
        })
        return
      }

      // Check permissions
      const isAssignee = req.user!.id === currentWorkOrder.assigned_to
      const isCreator = req.user!.id === currentWorkOrder.created_by
      const isAdmin = req.user!.role === 'admin' || req.user!.role === 'manager'

      if (!isAssignee && !isCreator && !isAdmin) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You can only update work orders assigned to you or created by you'
        })
        return
      }

      // Only allow certain updates for assignees
      if (isAssignee && !isCreator && !isAdmin) {
        const allowedFields = ['status']
        const updateKeys = Object.keys(updateData)
        const hasDisallowedFields = updateKeys.some(key => !allowedFields.includes(key))

        if (hasDisallowedFields) {
          res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'You can only update the status of work orders assigned to you'
          })
          return
        }

        // Only allow certain status transitions
        if (updateData.status) {
          const allowedTransitions = {
            'open': ['in_progress', 'cancelled'],
            'in_progress': ['completed', 'cancelled'],
            'completed': [], // Can't change from completed
            'cancelled': [] // Can't change from cancelled
          }

          const currentStatus = currentWorkOrder.status
          const allowedStatuses = allowedTransitions[currentStatus as keyof typeof allowedTransitions]

          if (!allowedStatuses.includes(updateData.status)) {
            res.status(400).json({
              success: false,
              error: 'Bad Request',
              message: `Cannot change status from ${currentStatus} to ${updateData.status}`
            })
            return
          }
        }
      }

      // Add completed_at timestamp if status is being set to completed
      if (updateData.status === 'completed' && currentWorkOrder.status !== 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .update(updateData)
          .eq('id', id)
          .select(`
            *,
            equipment!work_orders_equipment_id_fkey (
              id,
              name,
              location
            ),
            users!work_orders_assigned_to_fkey (
              id,
              name,
              email
            ),
            creator:users!work_orders_created_by_fkey (
              id,
              name,
              email
            )
          `)
          .single(),
        'updateWorkOrder'
      )

      if (error) {
        throw error
      }

      logger.info(`Work order updated successfully`, {
        userId: req.user?.id,
        workOrderId: id,
        updatedFields: Object.keys(updateData)
      })

      res.json({
        success: true,
        message: 'Work order updated successfully',
        data: {
          workOrder: data
        }
      })

    } catch (error) {
      logger.error('Update work order error:', error)
      next(error)
    }
  }
)

/**
 * DELETE /api/v1/work-orders/:id
 * Delete work order
 */
router.delete('/:id',
  requirePermission('work_orders', 'delete'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      // Check if work order is in a deletable state
      const { data: workOrder, error: fetchError } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .select('status')
          .eq('id', id)
          .single(),
        'getWorkOrderForDeletion'
      )

      if (fetchError || !workOrder) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Work order not found'
        })
        return
      }

      if (workOrder.status === 'in_progress' || workOrder.status === 'completed') {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Cannot delete work orders that are in progress or completed'
        })
        return
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .delete()
          .eq('id', id)
          .select('*')
          .single(),
        'deleteWorkOrder'
      )

      if (error) {
        throw error
      }

      logger.info(`Work order deleted successfully`, {
        userId: req.user?.id,
        workOrderId: id,
        title: data.title
      })

      res.json({
        success: true,
        message: 'Work order deleted successfully',
        data: {
          workOrder: data
        }
      })

    } catch (error) {
      logger.error('Delete work order error:', error)
      next(error)
    }
  }
)

export default router