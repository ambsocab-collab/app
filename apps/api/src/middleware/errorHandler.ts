import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export interface ApiError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export class AppError extends Error implements ApiError {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let { statusCode = 500, message } = err

  // Log error details
  // eslint-disable-next-line no-console
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // Handle specific error types
  if (err instanceof ZodError) {
    statusCode = 400
    message = 'Validation error'

    res.status(statusCode).json({
      success: false,
      error: 'Validation Error',
      message,
      details: err.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code
      }))
    })
    return
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // Handle database connection errors
  if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
    statusCode = 503
    message = 'Service temporarily unavailable'
  }

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'

  const errorResponse: Record<string, unknown> = {
    success: false,
    error: getErrorName(statusCode),
    message: isDevelopment ? err.message : message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  }

  // Include stack trace in development
  if (isDevelopment && err.stack) {
    errorResponse.stack = err.stack
  }

  // Include request ID if available
  const requestId = req.headers['x-request-id']
  if (requestId) {
    errorResponse.requestId = requestId
  }

  res.status(statusCode).json(errorResponse)
}

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404)
  next(error)
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

function getErrorName(statusCode: number): string {
  const statusMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  }

  return statusMessages[statusCode] || 'Error'
}