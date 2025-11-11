import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import compression from 'compression'
import { apiLimiter, authLimiter, generalLimiter } from './middleware/rateLimiter.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { setupSwagger } from './config/swagger.js'
import { logger } from './utils/logger.js'
import { metricsMiddleware } from './monitoring/metrics.js'
import { securityMiddleware } from './middleware/security.js'
import { addPermissionsHeader } from './middleware/auth.js'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import equipmentRoutes from './routes/equipment.js'
import workOrderRoutes from './routes/workOrders.js'
import sparePartRoutes from './routes/spareParts.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(securityMiddleware)

// Compression middleware
app.use(compression()) // Gzip compression

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
}

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Performance monitoring middleware
app.use(metricsMiddleware)

// Rate limiting middleware
app.use(generalLimiter) // Apply to all routes

// Add permissions header for debugging
app.use(addPermissionsHeader)

// Health check endpoint (excluded from rate limiting)
app.get('/health', async (_req, res) => {
  try {
    // Basic health info
    const healthInfo = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
      },
      cpu: {
        usage: Math.round(process.cpuUsage().user / 1000) / 1000
      }
    }

    res.json(healthInfo)
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      timestamp: new Date().toISOString()
    })
  }
})

// Authentication routes with stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes)

// API routes with standard API rate limiting
app.use('/api/v1', apiLimiter)

// API v1 routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/equipment', equipmentRoutes)
app.use('/api/v1/work-orders', workOrderRoutes)
app.use('/api/v1/spare-parts', sparePartRoutes)

// Setup Swagger documentation
setupSwagger(app)

// API info endpoint
app.use('/api/v1', (_req, res) => {
  res.json({
    message: 'GMAO API - Backend infrastructure complete with authentication!',
    status: 'production-ready',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      documentation: '/api/docs',
      auth: '/api/auth',
      api: '/api/v1',
      users: '/api/v1/users',
      equipment: '/api/v1/equipment',
      workOrders: '/api/v1/work-orders',
      spareParts: '/api/v1/spare-parts'
    },
    authentication: {
      type: 'JWT Bearer Token',
      login: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      profile: 'GET /api/auth/me'
    },
    features: [
      '✅ JWT Authentication',
      '✅ Role-based Access Control',
      '✅ Input Validation',
      '✅ Rate Limiting',
      '✅ Security Headers',
      '✅ Performance Monitoring',
      '✅ Database Resilience',
      '✅ Comprehensive Logging'
    ]
  })
})

// 404 handler
app.use('*', notFoundHandler)

// Comprehensive error handling middleware
app.use(errorHandler)

const server = app.listen(PORT, () => {
  logger.info(`🚀 GMAO API Server running on port ${PORT}`)
  logger.info(`📖 API Documentation: http://localhost:${PORT}/api/docs`)
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`)
})

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`)

  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 30000)
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})