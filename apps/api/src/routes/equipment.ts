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
  requireMinimumRole
} from '../middleware/rbac.js'
import {
  validate,
  PaginationSchema,
  IdParamsSchema,
  EquipmentCreateSchema,
  EquipmentUpdateSchema
} from '../middleware/validation.js'

const router = Router()

// Apply authentication to all equipment routes
router.use(authenticateToken)

/**
 * GET /api/v1/equipment
 * Get all equipment (paginated)
 */
router.get('/',
  requireMinimumRole('technician'),
  validate({ query: PaginationSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, sort, order } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('equipment')
        .select('*', {
          count: 'exact'
        })
        .range(offset, offset + limit - 1)

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,model.ilike.%${search}%,serial_number.ilike.%${search}%,location.ilike.%${search}%`)
      }

      // Apply sorting
      if (sort && order) {
        query = query.order(sort, { ascending: order === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await withDatabaseRetry(
        () => query,
        'getEquipment'
      )

      if (error) {
        throw error
      }

      logger.info(`Equipment retrieved successfully`, {
        userId: req.user?.id,
        count: data?.length,
        page,
        limit
      })

      res.json({
        success: true,
        data: {
          equipment: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }
      })

    } catch (error) {
      logger.error('Get equipment error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/equipment/:id
 * Get specific equipment by ID
 */
router.get('/:id',
  requireMinimumRole('technician'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('equipment')
          .select('*')
          .eq('id', id)
          .single(),
        'getEquipmentById'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Equipment not found'
          })
          return
        }
        throw error
      }

      logger.info(`Equipment retrieved successfully`, {
        userId: req.user?.id,
        equipmentId: id
      })

      res.json({
        success: true,
        data: {
          equipment: data
        }
      })

    } catch (error) {
      logger.error('Get equipment error:', error)
      next(error)
    }
  }
)

/**
 * POST /api/v1/equipment
 * Create new equipment
 */
router.post('/',
  requirePermission('equipment', 'create'),
  validate({ body: EquipmentCreateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const equipmentData = req.validatedBody!

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('equipment')
          .insert(equipmentData)
          .select('*')
          .single(),
        'createEquipment'
      )

      if (error) {
        throw error
      }

      logger.info(`Equipment created successfully`, {
        userId: req.user?.id,
        equipmentId: data.id,
        name: data.name
      })

      res.status(201).json({
        success: true,
        message: 'Equipment created successfully',
        data: {
          equipment: data
        }
      })

    } catch (error) {
      logger.error('Create equipment error:', error)
      next(error)
    }
  }
)

/**
 * PUT /api/v1/equipment/:id
 * Update equipment
 */
router.put('/:id',
  requirePermission('equipment', 'update'),
  validate({ params: IdParamsSchema, body: EquipmentUpdateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const updateData = req.validatedBody!

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('equipment')
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single(),
        'updateEquipment'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Equipment not found'
          })
          return
        }
        throw error
      }

      logger.info(`Equipment updated successfully`, {
        userId: req.user?.id,
        equipmentId: id,
        updatedFields: Object.keys(updateData)
      })

      res.json({
        success: true,
        message: 'Equipment updated successfully',
        data: {
          equipment: data
        }
      })

    } catch (error) {
      logger.error('Update equipment error:', error)
      next(error)
    }
  }
)

/**
 * DELETE /api/v1/equipment/:id
 * Delete equipment
 */
router.delete('/:id',
  requirePermission('equipment', 'delete'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      // Check if equipment has associated work orders
      const { data: workOrders } = await withDatabaseRetry(
        () => supabase
          .from('work_orders')
          .select('id')
          .eq('equipment_id', id)
          .limit(1),
        'checkEquipmentWorkOrders'
      )

      if (workOrders && workOrders.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Cannot delete equipment with associated work orders'
        })
        return
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('equipment')
          .delete()
          .eq('id', id)
          .select('*')
          .single(),
        'deleteEquipment'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Equipment not found'
          })
          return
        }
        throw error
      }

      logger.info(`Equipment deleted successfully`, {
        userId: req.user?.id,
        equipmentId: id,
        equipmentName: data.name
      })

      res.json({
        success: true,
        message: 'Equipment deleted successfully',
        data: {
          equipment: data
        }
      })

    } catch (error) {
      logger.error('Delete equipment error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/equipment/:id/work-orders
 * Get work orders for specific equipment
 */
router.get('/:id/work-orders',
  requireMinimumRole('technician'),
  validate({
    params: IdParamsSchema,
    query: PaginationSchema
  }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const { page, limit, search, sort, order } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('work_orders')
        .select(`
          *,
          users!work_orders_assigned_to_fkey (
            id,
            name,
            email
          )
        `, {
          count: 'exact'
        })
        .eq('equipment_id', id)
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
        'getEquipmentWorkOrders'
      )

      if (error) {
        throw error
      }

      logger.info(`Equipment work orders retrieved successfully`, {
        userId: req.user?.id,
        equipmentId: id,
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
      logger.error('Get equipment work orders error:', error)
      next(error)
    }
  }
)

export default router