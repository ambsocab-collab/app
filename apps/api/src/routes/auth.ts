import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { supabase, withDatabaseRetry } from '../utils/database.js'
import { logger } from '../utils/logger.js'
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  AuthenticatedRequest
} from '../middleware/auth.js'

// Define request interfaces
interface LoginRequest extends Request {
  body: {
    email: string
    password: string
  }
}

interface RefreshRequest extends Request {
  body: {
    refreshToken: string
  }
}

// Input validation schemas
const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

const router = Router()

/**
 * Rate limiting for sensitive authentication endpoints
 * Note: This should be combined with authLimiter from the main server
 */

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
router.post('/login', async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const validationResult = LoginSchema.safeParse(req.body)
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: validationResult.error.errors
      })
      return
    }

    const { email, password } = validationResult.data

    // Find user by email
    const { data: user, error } = await withDatabaseRetry(
      () => supabase
        .from('users')
        .select('id, email, name, role, password_hash, status, last_login')
        .eq('email', email.toLowerCase())
        .single(),
      'findUserByEmail'
    )

    if (error || !user) {
      logger.warn(`Login attempt with non-existent email: ${email}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      })

      res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      })
      return
    }

    // Check if user is active
    if (user.status !== 'active') {
      logger.warn(`Login attempt with inactive user: ${email}`, {
        userId: user.id,
        status: user.status,
        ip: req.ip
      })

      res.status(401).json({
        success: false,
        error: 'Account Disabled',
        message: 'Your account has been disabled. Please contact administrator.'
      })
      return
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for user: ${email}`, {
        userId: user.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      })

      res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      })
      return
    }

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Update last login timestamp
    await withDatabaseRetry(
      () => supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id),
      'updateLastLogin'
    )

    // Log successful login
    logger.info(`User logged in successfully: ${user.email}`, {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      lastLogin: user.last_login
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          last_login: new Date().toISOString()
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        }
      }
    })

  } catch (error) {
    logger.error('Login error:', error)
    next(error)
  }
})

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: RefreshRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const validationResult = RefreshTokenSchema.safeParse(req.body)
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: validationResult.error.errors
      })
      return
    }

    const { refreshToken } = validationResult.data

    // Use the refresh token validation middleware logic
    const authReq = req as AuthenticatedRequest
    await validateRefreshToken(authReq, res, async () => {
      if (!authReq.user) {
        return // Validation failed, response already sent
      }

      // Generate new tokens
      const tokenPayload = {
        id: authReq.user.id,
        email: authReq.user.email,
        name: authReq.user.name,
        role: authReq.user.role
      }

      const newAccessToken = generateAccessToken(tokenPayload)
      const newRefreshToken = generateRefreshToken(tokenPayload)

      logger.info(`Token refreshed for user: ${authReq.user.email}`, {
        userId: authReq.user.id,
        ip: req.ip
      })

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
          }
        }
      })
    })

  } catch (error) {
    logger.error('Token refresh error:', error)
    next(error)
  }
})

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 * In a production environment, you might want to maintain a token blacklist
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (token) {
      logger.info('User logged out', {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      })
    }

    // In a production environment, you could:
    // 1. Add the token to a blacklist (Redis/database)
    // 2. Implement token invalidation
    // 3. Clear any server-side session data

    res.json({
      success: true,
      message: 'Logout successful',
      data: {
        message: 'Please clear your tokens on the client side'
      }
    })

  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Logout service temporarily unavailable'
    })
  }
})

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This endpoint should be protected by the authenticateToken middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      })
      return
    }

    // Fetch fresh user data from database
    const { data: user, error } = await withDatabaseRetry(
      () => supabase
        .from('users')
        .select('id, email, name, role, status, created_at, updated_at, last_login')
        .eq('id', req.user!.id)
        .single(),
      'getUserProfile'
    )

    if (error || !user) {
      res.status(404).json({
        success: false,
        error: 'User Not Found',
        message: 'User profile not found'
      })
      return
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_login: user.last_login
        }
      }
    })

  } catch (error) {
    logger.error('Get profile error:', error)
    next(error)
  }
})

/**
 * POST /api/auth/verify
 * Verify if a token is valid (for client-side validation)
 */
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body

    if (!token) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Token is required'
      })
      return
    }

    const authHeader = `Bearer ${token}`
    const extractedToken = authHeader.replace('Bearer ', '')

    try {
      const { verifyToken } = await import('../middleware/auth.js')
      const decoded = verifyToken(extractedToken)

      if (decoded.type === 'refresh') {
        res.status(400).json({
          success: false,
          error: 'Invalid Token Type',
          message: 'Refresh tokens cannot be verified through this endpoint'
        })
        return
      }

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          valid: true,
          payload: {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
          }
        }
      })

    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid Token',
        message: error instanceof Error ? error.message : 'Token verification failed',
        data: {
          valid: false
        }
      })
    }

  } catch (error) {
    logger.error('Token verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Token verification service temporarily unavailable'
    })
  }
})

export default router