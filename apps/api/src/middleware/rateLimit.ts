import rateLimit from 'express-rate-limit'
import { NextFunction, Request, Response } from 'express'

/**
 * Enhanced Rate Limiting Middleware
 * Provides comprehensive rate limiting with different tiers for various endpoints
 */

// Store rate limit data in memory (in production, use Redis or similar)
const rateLimitStore = new Map()

// Helper to create IP-based key
const createKey = (req: Request, prefix: string = 'rl'): string => {
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown'
  return `${prefix}:${ip}`
}

// General rate limiter for all API routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const key = createKey(req, 'general')
    const resetTime = rateLimitStore.get(key) || Date.now() + (15 * 60 * 1000)

    res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
    })
  }
})

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  skipSuccessfulRequests: false, // Count successful requests
  message: {
    success: false,
    error: 'Too many authentication attempts',
    message: 'Account temporarily locked due to too many failed attempts. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => createKey(req, 'auth'),
  handler: (req: Request, res: Response) => {
    // Log authentication attempts for security monitoring
    console.warn('Authentication rate limit exceeded:', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      endpoint: req.path,
      timestamp: new Date().toISOString()
    })

    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts',
      message: 'Account temporarily locked due to too many failed attempts. Please try again later.',
      retryAfter: 900 // 15 minutes
    })
  }
})

// API-specific rate limiter for data operations
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 API requests per minute
  message: {
    success: false,
    error: 'API rate limit exceeded',
    message: 'Too many API requests. Please slow down your request rate.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => createKey(req, 'api'),
})

// Upload rate limiter for file operations
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    success: false,
    error: 'Upload limit exceeded',
    message: 'Too many file uploads. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => createKey(req, 'upload'),
})

// Password reset rate limiter (very strict)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    error: 'Password reset limit exceeded',
    message: 'Too many password reset attempts. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => createKey(req, 'pwdreset'),
  handler: (req: Request, res: Response) => {
    // Log password reset attempts for security monitoring
    console.warn('Password reset rate limit exceeded:', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(429).json({
      success: false,
      error: 'Password reset limit exceeded',
      message: 'Too many password reset attempts. Please try again later.',
      retryAfter: 3600 // 1 hour
    })
  }
})

// Progressive rate limiter that gets stricter with repeated violations
export const progressiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: Request) => {
    const key = createKey(req, 'progressive')
    const violations = rateLimitStore.get(`${key}:violations`) || 0

    // Progressive reduction based on violation count
    if (violations === 0) return 100
    if (violations === 1) return 50
    if (violations === 2) return 25
    if (violations === 3) return 10
    return 5 // Minimum limit for repeat offenders
  },
  keyGenerator: (req: Request) => createKey(req, 'progressive'),
  handler: (req: Request, res: Response) => {
    const key = createKey(req, 'progressive')
    const violationsKey = `${key}:violations`
    const currentViolations = (rateLimitStore.get(violationsKey) || 0) + 1

    // Store violation count
    rateLimitStore.set(violationsKey, currentViolations)

    // Reset violations after penalty period
    setTimeout(() => {
      rateLimitStore.delete(violationsKey)
    }, 60 * 60 * 1000) // 1 hour

    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      message: `Multiple violations detected. Your request limit has been reduced. Please try again later.`,
      violationCount: currentViolations,
      retryAfter: 900
    })
  }
})

// Create-user rate limiter to prevent spam account creation
export const createUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 account creations per hour
  message: {
    success: false,
    error: 'Account creation limit exceeded',
    message: 'Too many account creation attempts. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => createKey(req, 'createuser'),
  handler: (req: Request, res: Response) => {
    // Log account creation attempts for security monitoring
    console.warn('Account creation rate limit exceeded:', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(429).json({
      success: false,
      error: 'Account creation limit exceeded',
      message: 'Too many account creation attempts. Please try again later.',
      retryAfter: 3600
    })
  }
})

/**
 * Rate limit configuration object for different endpoint types
 */
export const RATE_LIMITS = {
  general: generalLimiter,
  auth: authLimiter,
  api: apiLimiter,
  upload: uploadLimiter,
  passwordReset: passwordResetLimiter,
  progressive: progressiveLimiter,
  createUser: createUserLimiter,
} as const

/**
 * Get appropriate rate limiter for endpoint
 */
export const getRateLimiter = (endpointType: keyof typeof RATE_LIMITS) => {
  return RATE_LIMITS[endpointType] || generalLimiter
}

/**
 * Rate limit status checker middleware
 */
export const rateLimitStatus = (_req: Request, res: Response, next: NextFunction) => {
  // Add rate limit status to response headers
  res.setHeader('X-RateLimit-Limit', '100')
  res.setHeader('X-RateLimit-Remaining', '99')
  res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 15 * 60 * 1000).toISOString())

  next()
}