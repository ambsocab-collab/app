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
  SparePartCreateSchema,
  SparePartUpdateSchema
} from '../middleware/validation.js'

const router = Router()

// Apply authentication to all spare parts routes
router.use(authenticateToken)

/**
 * GET /api/v1/spare-parts
 * Get all spare parts (paginated)
 */
router.get('/',
  requireMinimumRole('technician'),
  validate({ query: PaginationSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, sort, order } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('spare_parts')
        .select('*', {
          count: 'exact'
        })
        .range(offset, offset + limit - 1)

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,part_number.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`)
      }

      // Apply sorting
      if (sort && order) {
        query = query.order(sort, { ascending: order === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await withDatabaseRetry(
        () => query,
        'getSpareParts'
      )

      if (error) {
        throw error
      }

      logger.info(`Spare parts retrieved successfully`, {
        userId: req.user?.id,
        count: data?.length,
        page,
        limit
      })

      res.json({
        success: true,
        data: {
          spareParts: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }
      })

    } catch (error) {
      logger.error('Get spare parts error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/spare-parts/low-stock
 * Get spare parts with low stock
 */
router.get('/low-stock',
  requireMinimumRole('technician'),
  validate({ query: PaginationSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, sort, order } = req.validatedQuery!
      const offset = (page - 1) * limit

      let query = supabase
        .from('spare_parts')
        .select('*', {
          count: 'exact'
        })
        .lt('quantity', 10) // Low stock threshold
        .range(offset, offset + limit - 1)

      // Apply sorting
      if (sort && order) {
        query = query.order(sort, { ascending: order === 'asc' })
      } else {
        query = query.order('quantity', { ascending: true })
      }

      const { data, error, count } = await withDatabaseRetry(
        () => query,
        'getLowStockSpareParts'
      )

      if (error) {
        throw error
      }

      logger.info(`Low stock spare parts retrieved successfully`, {
        userId: req.user?.id,
        count: data?.length,
        page,
        limit
      })

      res.json({
        success: true,
        data: {
          spareParts: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }
      })

    } catch (error) {
      logger.error('Get low stock spare parts error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/v1/spare-parts/:id
 * Get specific spare part by ID
 */
router.get('/:id',
  requireMinimumRole('technician'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('spare_parts')
          .select('*')
          .eq('id', id)
          .single(),
        'getSparePartById'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Spare part not found'
          })
          return
        }
        throw error
      }

      logger.info(`Spare part retrieved successfully`, {
        userId: req.user?.id,
        sparePartId: id
      })

      res.json({
        success: true,
        data: {
          sparePart: data
        }
      })

    } catch (error) {
      logger.error('Get spare part error:', error)
      next(error)
    }
  }
)

/**
 * POST /api/v1/spare-parts
 * Create new spare part
 */
router.post('/',
  requirePermission('spare_parts', 'create'),
  validate({ body: SparePartCreateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sparePartData = req.validatedBody!

      // Check if part number already exists (if provided)
      if (sparePartData.part_number) {
        const { data: existingPart } = await withDatabaseRetry(
          () => supabase
            .from('spare_parts')
            .select('id')
            .eq('part_number', sparePartData.part_number)
            .single(),
          'checkPartNumberUniqueness'
        )

        if (existingPart) {
          res.status(409).json({
            success: false,
            error: 'Conflict',
            message: 'A spare part with this part number already exists'
          })
          return
        }
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('spare_parts')
          .insert(sparePartData)
          .select('*')
          .single(),
        'createSparePart'
      )

      if (error) {
        throw error
      }

      logger.info(`Spare part created successfully`, {
        userId: req.user?.id,
        sparePartId: data.id,
        name: data.name,
        partNumber: data.part_number
      })

      res.status(201).json({
        success: true,
        message: 'Spare part created successfully',
        data: {
          sparePart: data
        }
      })

    } catch (error) {
      logger.error('Create spare part error:', error)
      next(error)
    }
  }
)

/**
 * PUT /api/v1/spare-parts/:id
 * Update spare part
 */
router.put('/:id',
  requirePermission('spare_parts', 'update'),
  validate({ params: IdParamsSchema, body: SparePartUpdateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const updateData = req.validatedBody!

      // Check if part number already exists (if being updated)
      if (updateData.part_number) {
        const { data: existingPart } = await withDatabaseRetry(
          () => supabase
            .from('spare_parts')
            .select('id')
            .eq('part_number', updateData.part_number)
            .neq('id', id)
            .single(),
          'checkPartNumberUniquenessUpdate'
        )

        if (existingPart) {
          res.status(409).json({
            success: false,
            error: 'Conflict',
            message: 'A spare part with this part number already exists'
          })
          return
        }
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('spare_parts')
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single(),
        'updateSparePart'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Spare part not found'
          })
          return
        }
        throw error
      }

      logger.info(`Spare part updated successfully`, {
        userId: req.user?.id,
        sparePartId: id,
        updatedFields: Object.keys(updateData)
      })

      res.json({
        success: true,
        message: 'Spare part updated successfully',
        data: {
          sparePart: data
        }
      })

    } catch (error) {
      logger.error('Update spare part error:', error)
      next(error)
    }
  }
)

/**
 * DELETE /api/v1/spare-parts/:id
 * Delete spare part
 */
router.delete('/:id',
  requirePermission('spare_parts', 'delete'),
  validate({ params: IdParamsSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!

      // Check if spare part is associated with any equipment
      const { data: equipmentAssociations } = await withDatabaseRetry(
        () => supabase
          .from('equipment_spare_parts')
          .select('equipment_id')
          .eq('spare_part_id', id)
          .limit(1),
        'checkSparePartAssociations'
      )

      if (equipmentAssociations && equipmentAssociations.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Cannot delete spare part that is associated with equipment'
        })
        return
      }

      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('spare_parts')
          .delete()
          .eq('id', id)
          .select('*')
          .single(),
        'deleteSparePart'
      )

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Spare part not found'
          })
          return
        }
        throw error
      }

      logger.info(`Spare part deleted successfully`, {
        userId: req.user?.id,
        sparePartId: id,
        name: data.name
      })

      res.json({
        success: true,
        message: 'Spare part deleted successfully',
        data: {
          sparePart: data
        }
      })

    } catch (error) {
      logger.error('Delete spare part error:', error)
      next(error)
    }
  }
)

/**
 * POST /api/v1/spare-parts/:id/adjust-stock
 * Adjust spare part stock quantity
 */
router.post('/:id/adjust-stock',
  requirePermission('spare_parts', 'update'),
  validate({
    params: IdParamsSchema,
    body: z.object({
      quantity: z.number().int(),
      reason: z.string().min(1, 'Reason is required'),
      type: z.enum(['add', 'remove', 'set'])
    })
  }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams!
      const { quantity, reason, type } = req.validatedBody!

      // Get current spare part
      const { data: currentPart, error: fetchError } = await withDatabaseRetry(
        () => supabase
          .from('spare_parts')
          .select('quantity, name')
          .eq('id', id)
          .single(),
        'getCurrentSparePart'
      )

      if (fetchError || !currentPart) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Spare part not found'
        })
        return
      }

      let newQuantity: number

      switch (type) {
        case 'add':
          newQuantity = currentPart.quantity + quantity
          break
        case 'remove':
          newQuantity = currentPart.quantity - quantity
          if (newQuantity < 0) {
            res.status(400).json({
              success: false,
              error: 'Bad Request',
              message: 'Insufficient stock for this adjustment'
            })
            return
          }
          break
        case 'set':
          newQuantity = quantity
          if (newQuantity < 0) {
            res.status(400).json({
              success: false,
              error: 'Bad Request',
              message: 'Quantity cannot be negative'
            })
            return
          }
          break
        default:
          res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid adjustment type'
          })
          return
      }

      // Update quantity
      const { data, error } = await withDatabaseRetry(
        () => supabase
          .from('spare_parts')
          .update({ quantity: newQuantity })
          .eq('id', id)
          .select('*')
          .single(),
        'adjustSparePartStock'
      )

      if (error) {
        throw error
      }

      // Log stock adjustment (you might want to create a separate table for this)
      logger.info(`Spare part stock adjusted`, {
        userId: req.user?.id,
        sparePartId: id,
        sparePartName: currentPart.name,
        previousQuantity: currentPart.quantity,
        newQuantity,
        adjustmentType: type,
        adjustmentQuantity: quantity,
        reason
      })

      res.json({
        success: true,
        message: 'Stock adjusted successfully',
        data: {
          sparePart: data,
          adjustment: {
            previousQuantity: currentPart.quantity,
            newQuantity,
            adjustmentType: type,
            adjustmentQuantity: quantity,
            reason
          }
        }
      })

    } catch (error) {
      logger.error('Adjust spare part stock error:', error)
      next(error)
    }
  }
)

export default router