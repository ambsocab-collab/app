import { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import { logger } from '../utils/logger.js'

/**
 * Utility function to generate request IDs
 */
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Security middleware configuration
 * Provides comprehensive security headers and protections
 */

export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.supabase.io"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'"],
    },
  },
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // X-Frame-Options
  frameguard: { action: 'deny' },
  // X-Content-Type-Options
  noSniff: true,
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // X-XSS-Protection (deprecated but still useful for older browsers)
  xssFilter: true,
  // Permit cross-domain embedded content
  permittedCrossDomainPolicies: false,
  // Hide X-Powered-By header
  hidePoweredBy: true,
})

/**
 * CORS configuration
 */
export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
    ]

    if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
}

/**
 * IP-based security middleware
 */
export const ipSecurity = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress

  // List of blocked IPs (in a real app, this would come from a database or config)
  const blockedIps = process.env.BLOCKED_IPS?.split(',') || []

  if (blockedIps.includes(clientIp as string)) {
    res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'Your IP address has been blocked'
    })
    return
  }

  // Add security headers manually for any missing from helmet
  res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId())
  res.setHeader('X-Response-Time', Date.now().toString())

  next()
}

/**
 * Request size limiter
 */
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.headers['content-length']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (contentLength && parseInt(contentLength) > maxSize) {
    res.status(413).json({
      success: false,
      error: 'Payload Too Large',
      message: `Request body cannot exceed ${maxSize / (1024 * 1024)}MB`
    })
    return
  }

  next()
}

/**
 * Security audit middleware
 */
export const securityAudit = (req: Request, _res: Response, next: NextFunction) => {
  // Log security-relevant information
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_SECURITY_AUDIT === 'true') {
    logger.info('Security Audit:', {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      path: req.path,
      suspiciousHeaders: Object.keys(req.headers).filter(header =>
        header.toLowerCase().includes('x-') ||
        header.toLowerCase().includes('auth')
      )
    })
  }

  next()
}

/**
 * Comprehensive security middleware bundle
 */
export const securityMiddleware = [
  securityHeaders,
  ipSecurity,
  requestSizeLimiter,
  securityAudit,
]