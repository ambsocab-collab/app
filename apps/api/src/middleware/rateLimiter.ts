import rateLimit from 'express-rate-limit'

// General rate limiter for all API routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  skipSuccessfulRequests: false, // Count successful requests
  message: {
    success: false,
    error: 'Too many authentication attempts',
    message: 'Account temporarily locked due to too many failed attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// API-specific rate limiter for data operations
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 API requests per minute
  message: {
    success: false,
    error: 'API rate limit exceeded',
    message: 'Too many API requests. Please slow down your request rate.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})