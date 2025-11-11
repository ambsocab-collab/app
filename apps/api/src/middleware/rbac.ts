import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import { AuthenticatedRequest } from './auth.js'

// Define role hierarchy
export type UserRole = 'admin' | 'manager' | 'technician' | 'viewer'

// Role hierarchy - higher number means higher privilege
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  technician: 2,
  manager: 3,
  admin: 4
}

// Resource permissions
export interface ResourcePermissions {
  create: UserRole[]
  read: UserRole[]
  update: UserRole[]
  delete: UserRole[]
  list: UserRole[]
}

// Define permissions for different resources
export const RESOURCE_PERMISSIONS: Record<string, ResourcePermissions> = {
  // User management
  users: {
    create: ['admin'],
    read: ['admin', 'manager'],
    update: ['admin', 'manager'],
    delete: ['admin'],
    list: ['admin', 'manager']
  },

  // Equipment management
  equipment: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'technician'],
    update: ['admin', 'manager', 'technician'],
    delete: ['admin', 'manager'],
    list: ['admin', 'manager', 'technician', 'viewer']
  },

  // Work order management
  work_orders: {
    create: ['admin', 'manager', 'technician'],
    read: ['admin', 'manager', 'technician', 'viewer'],
    update: ['admin', 'manager', 'technician'],
    delete: ['admin', 'manager'],
    list: ['admin', 'manager', 'technician', 'viewer']
  },

  // Spare parts management
  spare_parts: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'technician'],
    update: ['admin', 'manager', 'technician'],
    delete: ['admin', 'manager'],
    list: ['admin', 'manager', 'technician', 'viewer']
  },

  // System administration
  system: {
    create: ['admin'],
    read: ['admin'],
    update: ['admin'],
    delete: ['admin'],
    list: ['admin']
  },

  // Reports and analytics
  reports: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'technician', 'viewer'],
    update: ['admin', 'manager'],
    delete: ['admin'],
    list: ['admin', 'manager', 'technician', 'viewer']
  },

  // Health checks and monitoring (public for authenticated users)
  health: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'technician', 'viewer'],
    update: ['admin'],
    delete: ['admin'],
    list: ['admin', 'manager', 'technician', 'viewer']
  }
}

/**
 * Check if a user has permission for a specific action on a resource
 */
export const hasPermission = (
  userRole: UserRole,
  resource: string,
  action: keyof ResourcePermissions
): boolean => {
  const permissions = RESOURCE_PERMISSIONS[resource]
  if (!permissions) {
    logger.warn(`Unknown resource: ${resource}`)
    return false
  }

  const allowedRoles = permissions[action]
  return allowedRoles.includes(userRole)
}

/**
 * Check if a user role is equal or higher than the required role
 */
export const hasMinimumRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Get all permissions for a user role
 */
export const getRolePermissions = (userRole: UserRole): Record<string, string[]> => {
  const permissions: Record<string, string[]> = {}

  Object.entries(RESOURCE_PERMISSIONS).forEach(([resource, resourcePerms]) => {
    permissions[resource] = []

    Object.entries(resourcePerms).forEach(([action, allowedRoles]) => {
      if (allowedRoles.includes(userRole)) {
        permissions[resource].push(action)
      }
    })
  })

  return permissions
}

/**
 * Role-based access control middleware factory
 */
export const requireRole = (requiredRoles: UserRole | UserRole[]) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required'
        })
        return
      }

      // Check if user has required role
      if (!roles.includes(req.user.role as UserRole)) {
        logger.warn(`Access denied for user ${req.user.email}: insufficient role`, {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: roles,
          path: req.path,
          method: req.method,
          ip: req.ip
        })

        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions to access this resource'
        })
        return
      }

      // User has required role, proceed
      next()

    } catch (error) {
      logger.error('Role-based access control error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Authorization service temporarily unavailable'
      })
    }
  }
}

/**
 * Resource-based access control middleware factory
 */
export const requirePermission = (resource: string, action: keyof ResourcePermissions) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required'
        })
        return
      }

      // Check if user has permission for this action
      const hasAccess = hasPermission(req.user.role as UserRole, resource, action)

      if (!hasAccess) {
        logger.warn(`Access denied for user ${req.user.email}: insufficient permissions`, {
          userId: req.user.id,
          userRole: req.user.role,
          resource,
          action,
          path: req.path,
          method: req.method,
          ip: req.ip
        })

        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: `Insufficient permissions to ${action} ${resource}`
        })
        return
      }

      // User has permission, proceed
      next()

    } catch (error) {
      logger.error('Permission-based access control error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Authorization service temporarily unavailable'
      })
    }
  }
}

/**
 * Minimum role middleware factory
 */
export const requireMinimumRole = (minimumRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required'
        })
        return
      }

      // Check if user has minimum role
      const hasRequiredRole = hasMinimumRole(req.user.role as UserRole, minimumRole)

      if (!hasRequiredRole) {
        logger.warn(`Access denied for user ${req.user.email}: insufficient role level`, {
          userId: req.user.id,
          userRole: req.user.role,
          minimumRole,
          path: req.path,
          method: req.method,
          ip: req.ip
        })

        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: `This action requires ${minimumRole} role or higher`
        })
        return
      }

      // User has sufficient role, proceed
      next()

    } catch (error) {
      logger.error('Minimum role access control error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Authorization service temporarily unavailable'
      })
    }
  }
}

/**
 * Self-access middleware - allows users to access their own resources
 */
export const allowSelfAccess = (resourceIdParam: string = 'id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required'
        })
        return
      }

      // Get resource ID from request parameters
      const resourceId = req.params[resourceIdParam]

      // If user is admin, allow access
      if (req.user.role === 'admin') {
        next()
        return
      }

      // If accessing own resource, allow access
      if (req.user.id === resourceId) {
        next()
        return
      }

      // Otherwise, require appropriate permissions based on resource type
      const resource = req.baseUrl.split('/').pop() || 'unknown'
      const method = req.method.toLowerCase()

      let action: keyof ResourcePermissions
      switch (method) {
        case 'get':
          action = 'read'
          break
        case 'post':
          action = 'create'
          break
        case 'put':
        case 'patch':
          action = 'update'
          break
        case 'delete':
          action = 'delete'
          break
        default:
          res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'Method not allowed'
          })
          return
      }

      const hasAccess = hasPermission(req.user.role as UserRole, resource, action)

      if (!hasAccess) {
        logger.warn(`Self-access denied for user ${req.user.email}`, {
          userId: req.user.id,
          targetResourceId: resourceId,
          resource,
          action,
          path: req.path,
          method: req.method,
          ip: req.ip
        })

        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You can only access your own resources'
        })
        return
      }

      next()

    } catch (error) {
      logger.error('Self-access control error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Authorization service temporarily unavailable'
      })
    }
  }
}

/**
 * Middleware to add user permissions to response headers (for debugging)
 */
export const addPermissionsHeader = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    if (req.user) {
      const permissions = getRolePermissions(req.user.role as UserRole)
      res.setHeader('X-User-Permissions', JSON.stringify(permissions))
      res.setHeader('X-User-Role', req.user.role)
    }
    next()
  } catch (error) {
    // Don't block the request for header generation errors
    logger.warn('Failed to add permissions header:', error)
    next()
  }
}

// Common role middleware shortcuts
export const requireAdmin = requireRole('admin')
export const requireManager = requireRole(['admin', 'manager'])
export const requireTechnician = requireRole(['admin', 'manager', 'technician'])
export const requireViewer = requireRole(['admin', 'manager', 'technician', 'viewer']) // All authenticated users

export default {
  requireRole,
  requirePermission,
  requireMinimumRole,
  allowSelfAccess,
  addPermissionsHeader,
  hasPermission,
  hasMinimumRole,
  getRolePermissions,
  // Common shortcuts
  requireAdmin,
  requireManager,
  requireTechnician,
  requireViewer
}